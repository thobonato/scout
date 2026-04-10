// ---------------------------------------------------------------------------
// Sitter View — Types
// ---------------------------------------------------------------------------

export type SitterTaskCategory = "food" | "exercise" | "medicine";

export interface SitterTask {
  id: string;
  category: SitterTaskCategory;
  label: string;
  time?: string;
  note?: string;
  isCompleted: boolean;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

export interface SitterPetProfile {
  name: string;
  breed: string;
  age: string;
  photoUrl: string;
  avatarUrl?: string;
  weight?: string;
  specialNotes?: string;
  emergencyContact?: string;
  vetInfo?: string;
}

export interface SitterFulfillmentState {
  food: number;
  exercise: number;
  medicine: number;
}

export interface SitterActivityEntry {
  taskId: string;
  label: string;
  category: SitterTaskCategory;
  completedAt: string;
}

export interface SitterLandingData {
  token: string;
  pet: SitterPetProfile;
  session: {
    id: string;
    label: string;
    startDate: string;
    endDate: string;
    dropOffTime?: string;
    pickUpTime?: string;
  };
  fulfillment: SitterFulfillmentState;
  recentActivity: SitterActivityEntry[];
  totalTasks: number;
  completedTasks: number;
}

// ---------------------------------------------------------------------------
// Routine page — day-wise tasks
// ---------------------------------------------------------------------------

export interface SitterDayRoutine {
  date: string;
  dayLabel: string;
  tasks: SitterTask[];
}

export interface SitterRoutineData {
  token: string;
  petName: string;
  sessionLabel: string;
  days: SitterDayRoutine[];
}

// ---------------------------------------------------------------------------
// API Contract (placeholder for backend team)
// ---------------------------------------------------------------------------
//
// The frontend provisions for these endpoints. All type definitions
// are in this file.
//
//   GET  /api/sitter/:token          → SitterLandingData
//   GET  /api/sitter/:token/routine  → SitterRoutineData
//   POST /api/sitter/:token/tasks/:taskId/toggle
//        Body:  { completed: boolean }
//        Returns: { task: SitterTask, updatedFulfillment: SitterFulfillmentState }
//
// No auth required — the token in the URL is the access credential.
// Response convention: { data: <payload> } on success, { error: string } on failure.
//
// ---------------------------------------------------------------------------
