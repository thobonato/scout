import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SitterInviteBody {
  email: string;
  role: "full_access" | "view_only";
  petId: string;
}

interface SitterInviteResponse {
  data?: { inviteId: string; email: string };
  error?: string;
}

// ---------------------------------------------------------------------------
// POST /api/sitters/invite
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SitterInviteResponse>> {
  const body = (await request.json()) as Partial<SitterInviteBody>;

  if (!body.email || !body.role || !body.petId) {
    return NextResponse.json(
      { error: "Missing email, role, or petId" },
      { status: 400 },
    );
  }

  const validRoles = ["full_access", "view_only"];
  if (!validRoles.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // TODO: replace with lib/sitters.ts call, e.g. sendSitterInvite(body)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
