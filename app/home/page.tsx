"use client";

import { useState } from "react";
import { PetAvatar } from "./components/PetAvatar";
import { PetCTACard } from "./components/PetCTACard";
import { ItemModal } from "./components/ItemModal";
import { mockPet, feedItems, toyItems, medicineItems } from "./mock-data";
import type { ModalType, AnyItem } from "./types";

const MODAL_ITEMS: Record<Exclude<ModalType, null>, AnyItem[]> = {
  feed: feedItems,
  play: toyItems,
  medicine: medicineItems,
};

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loggedTypes, setLoggedTypes] = useState<Set<Exclude<ModalType, null>>>(
    new Set(),
  );

  function handleConfirm() {
    if (!activeModal) {
      return;
    }
    setLoggedTypes((prev) => new Set(prev).add(activeModal));
  }

  const ctaTypes: Exclude<ModalType, null>[] = ["feed", "play", "medicine"];

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-md sm:max-w-lg mx-auto px-4 py-12 flex flex-col gap-8">
        <PetAvatar pet={mockPet} />

        <div className="grid grid-cols-3 gap-3">
          {ctaTypes.map((type) => (
            <PetCTACard
              key={type}
              type={type}
              isLogged={loggedTypes.has(type)}
              onClick={() => setActiveModal(type)}
            />
          ))}
        </div>
      </div>

      <ItemModal
        key={activeModal ?? "closed"}
        type={activeModal}
        petName={mockPet.name}
        items={activeModal ? MODAL_ITEMS[activeModal] : []}
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
