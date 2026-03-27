import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getTodayLogs, logAction } from "@/lib/actions";
import type { GetActionsResponse, LogActionResponse } from "./types";

export async function GET(): Promise<NextResponse<GetActionsResponse>> {
  const logs = getTodayLogs();
  return NextResponse.json({ data: logs });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LogActionResponse>> {
  const body = await request.json();

  if (!body.category || !body.itemName) {
    return NextResponse.json(
      { error: "category and itemName are required" },
      { status: 400 },
    );
  }

  const validCategories = ["feed", "play", "medicine"];

  if (!validCategories.includes(body.category)) {
    return NextResponse.json(
      { error: "category must be feed, play, or medicine" },
      { status: 400 },
    );
  }

  const log = logAction(
    body.category,
    body.itemName,
    body.photoUrl,
    body.sessionId,
  );
  return NextResponse.json({ data: log });
}
