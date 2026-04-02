import { getPet } from '@/lib/queries/pets';
import { getStreaks, updateStreak } from '@/lib/queries/streaks';
import { getDailyTasks, toggleTaskCompletion } from '@/lib/queries/tasks';
import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types for this route's request / response
// ---------------------------------------------------------------------------
interface GetTrackerResponse {
  data?: {
    date: string;
    petName: string;
    tasks: Array<{
      id: string;
      category: 'food' | 'exercise' | 'medicine';
      label: string;
      isCompleted: boolean;
      time?: string;
      note?: string;
    }>;
    streaks: Record<'food' | 'exercise' | 'medicine', number>;
  };
  error?: string;
}

interface PatchTrackerBody {
  taskId: string;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// GET /api/tracker?petId=...&date=...
// ---------------------------------------------------------------------------
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetTrackerResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');
  const dateParam = request.nextUrl.searchParams.get('date');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  // Default to today's date
  const date = dateParam || new Date().toISOString().split('T')[0];

  const [pet, tasks, streakRecords] = await Promise.all([
    getPet(petId),
    getDailyTasks(petId, date),
    getStreaks(petId),
  ]);

  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  // Convert streaks array to object: { food: 5, exercise: 12, medicine: 3 }
  const streaks: Record<'food' | 'exercise' | 'medicine', number> = {
    food: 0,
    exercise: 0,
    medicine: 0,
  };

  streakRecords.forEach((streak) => {
    streaks[streak.category as 'food' | 'exercise' | 'medicine'] =
      streak.current_streak;
  });

  // Map tasks to expected format
  const formattedTasks = tasks.map((task) => ({
    id: task.id,
    category: task.category as 'food' | 'exercise' | 'medicine',
    label: task.label,
    isCompleted: task.is_completed,
    time: task.time || undefined,
    note: task.note || undefined,
  }));

  return NextResponse.json({
    data: {
      date,
      petName: pet.name,
      tasks: formattedTasks,
      streaks,
    },
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/tracker — toggle a task's completion status
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest): Promise<
  NextResponse<{
    data?: { taskId: string; isCompleted: boolean };
    error?: string;
  }>
> {
  const body = (await request.json()) as Partial<PatchTrackerBody>;

  if (!body.taskId || typeof body.isCompleted !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing taskId or isCompleted' },
      { status: 400 }
    );
  }

  const updatedTask = await toggleTaskCompletion(body.taskId, body.isCompleted);

  if (!updatedTask) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }

  // If task was marked complete, check if all tasks in category are done
  if (body.isCompleted) {
    const allTasksForDate = await getDailyTasks(
      updatedTask.pet_id,
      updatedTask.date
    );
    const tasksInCategory = allTasksForDate.filter(
      (t) => t.category === updatedTask.category
    );
    const allCategoryTasksDone = tasksInCategory.every((t) => t.is_completed);

    // If all done, update streak
    if (allCategoryTasksDone) {
      // Check if yesterday had all tasks done (for consecutive check)
      const yesterday = new Date(updatedTask.date);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDateStr = yesterday.toISOString().split('T')[0];

      const yesterdayTasks = await getDailyTasks(
        updatedTask.pet_id,
        yesterdayDateStr
      );
      const yesterdayTasksInCategory = yesterdayTasks.filter(
        (t) => t.category === updatedTask.category
      );
      const yesterdayAllDone =
        yesterdayTasksInCategory.length > 0 &&
        yesterdayTasksInCategory.every((t) => t.is_completed);

      await updateStreak(
        updatedTask.pet_id,
        updatedTask.category,
        yesterdayAllDone
      );
    }
  }

  return NextResponse.json({
    data: { taskId: body.taskId, isCompleted: body.isCompleted },
  });
}
