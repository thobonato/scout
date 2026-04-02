import { getUserSettings, updateUserSettings } from '@/lib/queries/settings';
import type { SettingsResponse } from '@/types/api';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/settings
 * Fetch current user's settings and notification preferences.
 *
 * TODO: Extract userId from Supabase auth session.
 */
export async function GET(): Promise<NextResponse<SettingsResponse>> {
  // TODO: const userId = await getCurrentUserId(); // from auth session
  const userId = 'temp-user-id';

  const settings = await getUserSettings(userId);

  if (!settings) {
    return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
  }

  return NextResponse.json({ data: settings });
}

/**
 * PATCH /api/settings
 * Update user settings (notifications, theme, language).
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<SettingsResponse>> {
  const body = await request.json();

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // TODO: const userId = await getCurrentUserId();
  const userId = 'temp-user-id';

  const updated = await updateUserSettings(userId, body);

  if (!updated) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: updated });
}
