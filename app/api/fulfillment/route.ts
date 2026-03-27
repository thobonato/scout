import { NextResponse } from "next/server";
import { getTodayLogs } from "@/lib/actions";
import { calculateFulfillment } from "@/lib/fulfillment";
import type { GetFulfillmentResponse } from "./types";

export async function GET(): Promise<NextResponse<GetFulfillmentResponse>> {
  const logs = getTodayLogs();
  const fulfillment = calculateFulfillment(logs);
  return NextResponse.json({ data: fulfillment });
}
