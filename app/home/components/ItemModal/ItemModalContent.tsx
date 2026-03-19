"use client";

import { useState } from "react";
import { ItemGrid } from "./ItemGrid";
import type { AnyItem, ModalType } from "../../types";

interface ItemModalContentProps {
  type: Exclude<ModalType, null>;
  petName: string;
  items: AnyItem[];
  onConfirm: () => void;
}

const MODAL_TITLE: Record<
  Exclude<ModalType, null>,
  (petName: string) => string
> = {
  feed: (petName: string) => `What did ${petName} eat today?`,
  play: (petName: string) => `Pick a toy for ${petName}`,
  medicine: (petName: string) => `Log ${petName}'s medicine`,
};

export function ItemModalContent({
  type,
  petName,
  items,
  onConfirm,
}: ItemModalContentProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function handleToggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function handleConfirm() {
    setSelectedIds([]);
    onConfirm();
  }

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-fredoka text-lg font-semibold text-text-dark">
        {MODAL_TITLE[type](petName)}
      </h2>

      <ItemGrid
        items={items}
        selectedIds={selectedIds}
        onToggle={handleToggle}
      />

      <button
        onClick={handleConfirm}
        disabled={!hasSelection}
        className={`
          w-full font-nunito font-bold py-3 rounded-full transition-all duration-200 text-sm
          ${
            hasSelection
              ? "bg-scout-blue hover:bg-scout-blue-dark text-white cursor-pointer shadow-md"
              : "bg-scout-blue/20 text-scout-blue/40 cursor-not-allowed"
          }
        `}
      >
        Log it
      </button>
    </div>
  );
}
