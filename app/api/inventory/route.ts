import {
  createInventoryItem,
  deleteInventoryItem,
  getInventory,
  updateInventoryItem,
} from '@/lib/queries/inventory';
import type {
  CreateInventoryRequest,
  CreateInventoryResponse,
  DeleteInventoryResponse,
  GetInventoryResponse,
  UpdateInventoryRequest,
  UpdateInventoryResponse,
} from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/inventory?petId=...
 * Fetch all inventory items for a pet.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetInventoryResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  const items = await getInventory(petId);
  return NextResponse.json({ data: items });
}

/**
 * POST /api/inventory
 * Create a new inventory item.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateInventoryResponse>> {
  const body = (await request.json()) as Partial<CreateInventoryRequest>;

  if (
    !body.petId ||
    !body.itemType ||
    !body.name ||
    body.quantity === undefined ||
    !body.unit
  ) {
    return NextResponse.json(
      {
        error: 'Missing required fields: petId, itemType, name, quantity, unit',
      },
      { status: 400 }
    );
  }

  const validTypes = ['toy', 'medicine', 'food'];
  if (!validTypes.includes(body.itemType)) {
    return NextResponse.json(
      { error: 'itemType must be toy, medicine, or food' },
      { status: 400 }
    );
  }

  const item = await createInventoryItem(
    body.petId,
    body.itemType,
    body.name,
    body.quantity,
    body.unit,
    body.notes
  );

  if (!item) {
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: item }, { status: 201 });
}

/**
 * PATCH /api/inventory
 * Update an inventory item.
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<UpdateInventoryResponse>> {
  const body = (await request.json()) as Partial<UpdateInventoryRequest>;

  if (!body.itemId) {
    return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
  }

  const item = await updateInventoryItem(body.itemId, {
    quantity: body.quantity,
    unit: body.unit,
    notes: body.notes,
    lastRestock: body.lastRestock,
  });

  if (!item) {
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: item });
}

/**
 * DELETE /api/inventory?itemId=...
 * Delete an inventory item.
 */
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<DeleteInventoryResponse>> {
  const itemId = request.nextUrl.searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json(
      { error: 'Missing itemId query parameter' },
      { status: 400 }
    );
  }

  const success = await deleteInventoryItem(itemId);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
