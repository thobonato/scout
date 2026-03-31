import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types for this route's request / response
// ---------------------------------------------------------------------------
interface GetTrackerResponse {
  data?: {
    date: string;
    petName: string;
    tasks: Array<{
      id: string;
      category: "food" | "exercise" | "medicine";
      label: string;
      isCompleted: boolean;
      time?: string;
      note?: string;
    }>;
    streaks: Record<"food" | "exercise" | "medicine", number>;
  };
  error?: string;
}

interface PatchTrackerBody {
  taskId: string;
  isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// GET /api/tracker?petId=...
// ---------------------------------------------------------------------------
export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetTrackerResponse>> {
  const petId = request.nextUrl.searchParams.get("petId");

  if (!petId) {
    return NextResponse.json({ error: "Missing petId" }, { status: 400 });
  }

  // TODO: replace with lib/tracker.ts call, e.g. getDailyTrackerData(petId)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// ---------------------------------------------------------------------------
// PATCH /api/tracker — toggle a task's completion status
// ---------------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
): Promise<
  NextResponse<{
    data?: { taskId: string; isCompleted: boolean };
    error?: string;
  }>
> {
  const body = (await request.json()) as Partial<PatchTrackerBody>;

  if (!body.taskId || typeof body.isCompleted !== "boolean") {
    return NextResponse.json(
      { error: "Missing taskId or isCompleted" },
      { status: 400 },
    );
  }

  // TODO: replace with lib/tracker.ts call, e.g. toggleTask(body.taskId, body.isCompleted)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
