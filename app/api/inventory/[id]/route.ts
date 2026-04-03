import { type NextRequest, NextResponse } from 'next/server';
import { updateInventoryItem, deleteInventoryItem } from '@/lib/inventory';
import type { UpdateInventoryItemInput } from '@/lib/inventory';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;
  const body = (await request.json()) as UpdateInventoryItemInput;

  try {
    const item = await updateInventoryItem(id, body);
    return NextResponse.json({ data: item });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params;

  try {
    await deleteInventoryItem(id);
    return NextResponse.json({ data: { id } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
