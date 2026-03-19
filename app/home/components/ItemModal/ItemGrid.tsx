import { ItemCard } from "./ItemCard";
import type { AnyItem } from "../../types";

interface ItemGridProps {
  items: AnyItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function ItemGrid({ items, selectedIds, onToggle }: ItemGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
