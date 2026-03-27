"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PawIcon } from "@/components/PawIcon/PawIcon";

interface PhotoUploadProps {
  photoUrl: string;
  onPhotoChange: (dataUrl: string) => void;
  onAvatarGenerated: (avatarUrl: string) => void;
}

export function PhotoUpload({
  photoUrl,
  onPhotoChange,
  onAvatarGenerated,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateAvatar(dataUrl: string): Promise<void> {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoDataUrl: dataUrl }),
      });

      const result = await response.json();

      if (result.data?.avatarUrl) {
        onAvatarGenerated(result.data.avatarUrl);
      }
    } finally {
      setIsGenerating(false);
    }
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
        onPhotoChange(result);
        generateAvatar(result);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleClick(): void {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-chewy-blue/30 hover:border-chewy-blue/60 bg-chewy-blue/5 hover:bg-chewy-blue/10 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden"
      >
        {photoUrl ? (
          <>
            <Image
              src={photoUrl}
              alt="Dog photo preview"
              fill
              className="object-cover"
              unoptimized
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
                <div className="w-8 h-8 animate-wag">
                  <PawIcon color="var(--chewy-blue)" opacity={1} />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-8 h-8 opacity-40">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-nunito text-xs font-semibold text-chewy-blue/60">
              Add Photo
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {photoUrl && !isGenerating && (
        <button
          type="button"
          onClick={handleClick}
          className="font-nunito text-xs font-semibold text-chewy-blue hover:text-chewy-blue-dark transition-colors"
        >
          Change photo
        </button>
      )}

      {isGenerating && (
        <span className="font-nunito text-xs font-semibold text-text-muted">
          Generating avatar...
        </span>
      )}
    </div>
  );
}
