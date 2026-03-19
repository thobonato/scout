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
    <div className="bg-page min-h-screen font-nunito">
      <div className="max-w-sm sm:max-w-md mx-auto px-5 py-16 flex flex-col items-center gap-10">
        <PetAvatar pet={mockPet} />

        <div className="w-full grid grid-cols-3 gap-4">
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
