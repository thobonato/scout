/**
 * Inventory Queries
 * Handle pet inventory (toys, medicine, food supplies)
 */

import { supabase } from '@/lib/supabase';
import type { InventoryItem } from '@/lib/types/database';

/**
 * Get all inventory items for a pet.
 */
export async function getInventory(petId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('pet_id', petId)
    .order('item_type', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single inventory item by ID.
 */
export async function getInventoryItem(
  itemId: string
): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', itemId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching inventory item:', error);
  }

  return data || null;
}

/**
 * Create a new inventory item.
 */
export async function createInventoryItem(
  petId: string,
  itemType: 'toy' | 'medicine' | 'food',
  name: string,
  quantity: number,
  unit: string,
  notes?: string
): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory')
    .insert([
      {
        pet_id: petId,
        item_type: itemType,
        name,
        quantity,
        unit,
        notes: notes || null,
        last_restocked_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating inventory item:', error);
    return null;
  }

  return data;
}

/**
 * Update an inventory item (quantity, notes, restock date).
 */
export async function updateInventoryItem(
  itemId: string,
  updates: {
    quantity?: number;
    unit?: string;
    notes?: string;
    lastRestock?: boolean;
  }
): Promise<InventoryItem | null> {
  const updatePayload: Record<string, unknown> = {};

  if (updates.quantity !== undefined) {
    updatePayload.quantity = updates.quantity;
  }
  if (updates.unit !== undefined) {
    updatePayload.unit = updates.unit;
  }
  if (updates.notes !== undefined) {
    updatePayload.notes = updates.notes;
  }
  if (updates.lastRestock) {
    updatePayload.last_restocked_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('inventory')
    .update(updatePayload)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating inventory item:', error);
    return null;
  }

  return data;
}

/**
 * Delete an inventory item.
 */
export async function deleteInventoryItem(itemId: string): Promise<boolean> {
  const { error } = await supabase.from('inventory').delete().eq('id', itemId);

  if (error) {
    console.error('Error deleting inventory item:', error);
    return false;
  }

  return true;
}
