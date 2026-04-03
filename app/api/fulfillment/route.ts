import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getTodayLogs } from '@/lib/actions';
import { calculateFulfillment } from '@/lib/fulfillment';
import type { GetFulfillmentResponse } from './types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetFulfillmentResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  try {
    const logs = await getTodayLogs(petId);
    const fulfillment = calculateFulfillment(logs);
    return NextResponse.json({ data: fulfillment });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
