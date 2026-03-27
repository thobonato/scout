import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateAvatar } from "@/lib/avatar";
import type { AvatarResponse } from "./types";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<AvatarResponse>> {
  const body = await request.json();

  if (!body.photoDataUrl || typeof body.photoDataUrl !== "string") {
    return NextResponse.json(
      { error: "photoDataUrl is required" },
      { status: 400 },
    );
  }

  const result = await generateAvatar({ photoDataUrl: body.photoDataUrl });

  return NextResponse.json({ data: result });
}
