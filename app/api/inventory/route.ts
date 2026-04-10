import { type NextRequest, NextResponse } from 'next/server';
import { getInventory, createInventoryItem } from '@/lib/inventory';
import type {
  CreateInventoryItemInput,
  InventoryItemType,
  InventoryUnit,
} from '@/lib/inventory';

const VALID_TYPES: InventoryItemType[] = ['food', 'medicine', 'toy', 'other'];
const VALID_UNITS: InventoryUnit[] = ['bag', 'can', 'bottle', 'box', 'count'];

export async function GET(request: NextRequest): Promise<NextResponse> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  try {
    const items = await getInventory(petId);
    return NextResponse.json({ data: items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as Partial<CreateInventoryItemInput>;

  if (!body.petId || !body.itemType || !body.name?.trim()) {
    return NextResponse.json(
      { error: 'petId, itemType, and name are required' },
      { status: 400 }
    );
  }

  if (!VALID_TYPES.includes(body.itemType)) {
    return NextResponse.json(
      { error: `itemType must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  if (body.unit && !VALID_UNITS.includes(body.unit)) {
    return NextResponse.json(
      { error: `unit must be one of: ${VALID_UNITS.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const item = await createInventoryItem(body as CreateInventoryItemInput);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
