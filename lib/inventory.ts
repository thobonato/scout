import { createClient } from '@/lib/supabase/server';

export type InventoryItemType = 'food' | 'medicine' | 'toy' | 'other';
export type InventoryUnit = 'bag' | 'can' | 'bottle' | 'box' | 'count';

export interface InventoryItem {
  id: string;
  petId: string;
  itemType: InventoryItemType;
  name: string;
  quantity: number;
  unit: InventoryUnit | null;
  restockDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemInput {
  petId: string;
  itemType: InventoryItemType;
  name: string;
  quantity?: number;
  unit?: InventoryUnit;
  restockDate?: string;
  notes?: string;
}

export interface UpdateInventoryItemInput {
  itemType?: InventoryItemType;
  name?: string;
  quantity?: number;
  unit?: InventoryUnit | null;
  restockDate?: string | null;
  notes?: string | null;
}

interface InventoryRow {
  id: string;
  pet_id: string;
  item_type: string;
  name: string;
  quantity: number;
  unit: string | null;
  restock_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function toInventoryItem(row: InventoryRow): InventoryItem {
  return {
    id: row.id,
    petId: row.pet_id,
    itemType: row.item_type as InventoryItemType,
    name: row.name,
    quantity: row.quantity,
    unit: (row.unit as InventoryUnit) ?? null,
    restockDate: row.restock_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getInventory(petId: string): Promise<InventoryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('pet_id', petId)
    .order('item_type')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return (data as InventoryRow[]).map(toInventoryItem);
}

export async function createInventoryItem(
  input: CreateInventoryItemInput
): Promise<InventoryItem> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .insert([
      {
        pet_id: input.petId,
        item_type: input.itemType,
        name: input.name,
        quantity: input.quantity ?? 1,
        unit: input.unit ?? null,
        restock_date: input.restockDate ?? null,
        notes: input.notes ?? null,
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toInventoryItem(data as InventoryRow);
}

export async function updateInventoryItem(
  id: string,
  updates: UpdateInventoryItemInput
): Promise<InventoryItem> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory')
    .update({
      ...(updates.itemType !== undefined && { item_type: updates.itemType }),
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.quantity !== undefined && { quantity: updates.quantity }),
      ...(updates.unit !== undefined && { unit: updates.unit }),
      ...(updates.restockDate !== undefined && {
        restock_date: updates.restockDate,
      }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toInventoryItem(data as InventoryRow);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('inventory').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
