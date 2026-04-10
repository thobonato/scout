import type { SitterLandingData, SitterRoutineData, SitterTask } from "./types";

// ---------------------------------------------------------------------------
// Shared task templates — same routine each day
// ---------------------------------------------------------------------------
function makeDayTasks(dateStr: string, completedIds: string[]): SitterTask[] {
  const prefix = dateStr.replace(/-/g, "");

  return [
    {
      id: `${prefix}-t1`,
      category: "food",
      label: "Morning kibble (1 cup)",
      time: "7:00 AM",
      isCompleted: completedIds.includes("t1"),
      completedAt: completedIds.includes("t1")
        ? `${dateStr}T07:10:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t2`,
      category: "food",
      label: "Evening kibble (1 cup)",
      time: "6:00 PM",
      isCompleted: completedIds.includes("t2"),
      completedAt: completedIds.includes("t2")
        ? `${dateStr}T18:05:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t3`,
      category: "food",
      label: "Fresh water refill",
      isCompleted: completedIds.includes("t3"),
      completedAt: completedIds.includes("t3")
        ? `${dateStr}T12:00:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t4`,
      category: "exercise",
      label: "Morning walk (30 min)",
      time: "8:00 AM",
      isCompleted: completedIds.includes("t4"),
      completedAt: completedIds.includes("t4")
        ? `${dateStr}T08:35:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t5`,
      category: "exercise",
      label: "Backyard play session",
      time: "4:00 PM",
      isCompleted: completedIds.includes("t5"),
      completedAt: completedIds.includes("t5")
        ? `${dateStr}T16:20:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t6`,
      category: "medicine",
      label: "Flea & tick tablet",
      note: "Give with food",
      time: "7:00 AM",
      isCompleted: completedIds.includes("t6"),
      completedAt: completedIds.includes("t6")
        ? `${dateStr}T07:15:00Z`
        : undefined,
    },
    {
      id: `${prefix}-t7`,
      category: "medicine",
      label: "Joint supplement (2 chews)",
      isCompleted: completedIds.includes("t7"),
      completedAt: completedIds.includes("t7")
        ? `${dateStr}T18:10:00Z`
        : undefined,
    },
  ];
}

// ---------------------------------------------------------------------------
// Mock: Landing page
// ---------------------------------------------------------------------------
export const MOCK_LANDING: SitterLandingData = {
  token: "abc123",
  pet: {
    name: "Biscuit",
    breed: "Golden Retriever",
    age: "3 years",
    photoUrl: "",
    weight: "65 lbs",
    specialNotes: "Allergic to chicken-based treats. Loves peanut butter.",
    emergencyContact: "Alex — (555) 012-3456",
    vetInfo: "Dr. Patel — Pawsome Vet Clinic — (555) 789-0000",
  },
  session: {
    id: "sess-1",
    label: "Weekend with Biscuit",
    startDate: "2026-04-07",
    endDate: "2026-04-09",
    dropOffTime: "8:00 AM",
    pickUpTime: "6:00 PM",
  },
  fulfillment: {
    food: 66,
    exercise: 50,
    medicine: 100,
  },
  recentActivity: [
    {
      taskId: "20260409-t6",
      label: "Flea & tick tablet",
      category: "medicine",
      completedAt: "2026-04-09T07:15:00Z",
    },
    {
      taskId: "20260409-t1",
      label: "Morning kibble (1 cup)",
      category: "food",
      completedAt: "2026-04-09T07:10:00Z",
    },
    {
      taskId: "20260408-t5",
      label: "Backyard play session",
      category: "exercise",
      completedAt: "2026-04-08T16:20:00Z",
    },
    {
      taskId: "20260408-t7",
      label: "Joint supplement (2 chews)",
      category: "medicine",
      completedAt: "2026-04-08T18:10:00Z",
    },
  ],
  totalTasks: 21,
  completedTasks: 11,
};

// ---------------------------------------------------------------------------
// Mock: Routine page (day-wise)
// ---------------------------------------------------------------------------
export const MOCK_ROUTINE: SitterRoutineData = {
  token: "abc123",
  petName: "Biscuit",
  sessionLabel: "Weekend with Biscuit",
  days: [
    {
      date: "2026-04-07",
      dayLabel: "Day 1 — Mon, Apr 7",
      tasks: makeDayTasks("2026-04-07", [
        "t1",
        "t2",
        "t3",
        "t4",
        "t5",
        "t6",
        "t7",
      ]),
    },
    {
      date: "2026-04-08",
      dayLabel: "Day 2 — Tue, Apr 8",
      tasks: makeDayTasks("2026-04-08", ["t1", "t3", "t4", "t6"]),
    },
    {
      date: "2026-04-09",
      dayLabel: "Day 3 — Wed, Apr 9",
      tasks: makeDayTasks("2026-04-09", ["t1", "t6"]),
    },
  ],
};
