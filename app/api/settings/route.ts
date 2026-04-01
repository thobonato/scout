import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SettingsResponse {
  data?: {
    ownerName: string;
    email: string;
    notifications: {
      dailyReminders: boolean;
      missedTaskAlerts: boolean;
      sitterUpdates: boolean;
      weeklyDigest: boolean;
    };
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// GET /api/settings
// ---------------------------------------------------------------------------
export async function GET(): Promise<NextResponse<SettingsResponse>> {
  // TODO: replace with lib/settings.ts call, e.g. getUserSettings(userId)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// ---------------------------------------------------------------------------
// PATCH /api/settings
// ---------------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
): Promise<NextResponse<SettingsResponse>> {
  const body = await request.json();

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // TODO: replace with lib/settings.ts call, e.g. updateUserSettings(userId, body)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
