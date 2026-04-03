-- Allow owners to delete their own inventory items (missing from initial schema).
CREATE POLICY "Owner can delete inventory" ON public.inventory
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = inventory.pet_id
      AND p.owner_id = auth.uid()
  )
);
