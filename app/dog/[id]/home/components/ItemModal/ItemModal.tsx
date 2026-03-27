"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { ActionCategory, CareItem } from "../../types";

interface ItemModalProps {
  isOpen: boolean;
  category: ActionCategory;
  items: CareItem[];
  onConfirm: (item: CareItem, photoUrl?: string) => void;
  onClose: () => void;
}

const categoryTitles: Record<ActionCategory, string> = {
  feed: "Feed Your Dog",
  play: "Play Time",
  medicine: "Give Medicine",
};

export function ItemModal({
  isOpen,
  category,
  items,
  onConfirm,
  onClose,
}: ItemModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "photo">("select");
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  function handleNext(): void {
    if (!selectedId) {
      return;
    }

    setStep("photo");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;

      if (typeof result === "string") {
        setPhotoUrl(result);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleConfirm(): void {
    const selected = items.find((item) => item.id === selectedId);

    if (!selected) {
      return;
    }

    onConfirm(selected, photoUrl || undefined);
    resetState();
  }

  function handleSkip(): void {
    const selected = items.find((item) => item.id === selectedId);

    if (!selected) {
      return;
    }

    onConfirm(selected, undefined);
    resetState();
  }

  function handleClose(): void {
    resetState();
    onClose();
  }

  function resetState(): void {
    setSelectedId(null);
    setStep("select");
    setPhotoUrl("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-warm-white rounded-t-3xl p-8 pb-10 animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </div>

        {step === "select" && (
          <>
            <h3 className="font-fredoka text-xl font-semibold text-text-dark mb-6 text-center">
              {categoryTitles[category]}
            </h3>

            {/* Item grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {items.map((item) => {
                const isSelected = selectedId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? "border-chewy-blue bg-chewy-blue/5 shadow-sm"
                        : "border-transparent bg-cream hover:bg-cream/80"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-nunito text-xs font-bold text-text-dark text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedId}
              className="w-full py-4 rounded-full font-nunito font-bold text-base transition-all bg-chewy-blue hover:bg-chewy-blue-dark text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </>
        )}

        {step === "photo" && (
          <>
            <h3 className="font-fredoka text-xl font-semibold text-text-dark mb-2 text-center">
              Add a Photo
            </h3>
            <p className="font-nunito text-sm text-text-muted text-center mb-6">
              Snap a pic of the moment!
            </p>

            {/* Photo area */}
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-chewy-blue/30 hover:border-chewy-blue/60 bg-chewy-blue/5 hover:bg-chewy-blue/10 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden"
              >
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Activity photo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <>
                    <Camera size={32} className="text-chewy-blue/40" />
                    <span className="font-nunito text-xs font-semibold text-chewy-blue/60">
                      Tap to add
                    </span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!photoUrl}
                className="w-full py-4 rounded-full font-nunito font-bold text-base transition-all bg-chewy-blue hover:bg-chewy-blue-dark text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save with Photo
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-3 rounded-full font-nunito font-semibold text-sm text-text-muted hover:text-text-dark transition-colors"
              >
                Skip Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
