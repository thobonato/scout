"use client";

import { useState } from "react";
import Image from "next/image";
import { Share2, Copy, Check, Download, Loader2 } from "lucide-react";
import { drawDogCard } from "./drawCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import type { DogProfile } from "@/app/create-dog/types";

interface ShareCardModalProps {
  dog: DogProfile;
  isOpen: boolean;
  onClose: () => void;
}

function formatSize(size: string | undefined): string | undefined {
  if (!size) {
    return undefined;
  }

  const labels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "extra-large": "XL",
  };

  return labels[size] || size;
}

function formatGender(gender: string | undefined): string | undefined {
  if (!gender || gender === "unknown") {
    return undefined;
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export function ShareCardModal({ dog, isOpen, onClose }: ShareCardModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const canNativeShare =
    typeof navigator !== "undefined" && Boolean(navigator.share);

  const details: Array<{ label: string; value: string | undefined }> = [
    { label: "Breed", value: dog.breed },
    {
      label: "Age",
      value: dog.age
        ? `${dog.age} ${Number(dog.age) === 1 ? "yr" : "yrs"}`
        : undefined,
    },
    { label: "Size", value: formatSize(dog.size) },
    { label: "Weight", value: dog.weight ? `${dog.weight} lbs` : undefined },
    { label: "Gender", value: formatGender(dog.gender) },
    { label: "Coat", value: dog.coatColor },
  ].filter((d) => d.value);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: `Meet ${dog.name}!`,
        text: `Check out ${dog.name}'s profile on Scout${dog.breed ? ` — ${dog.breed}` : ""}.`,
        url: shareUrl,
      });
    } catch {
      // User cancelled or share failed — fall back silently
    }
  }

  async function handleDownload() {
    setIsDownloading(true);

    try {
      const dataUrl = await drawDogCard(dog);
      const link = document.createElement("a");
      link.download = `${dog.name.toLowerCase().replace(/\s+/g, "-")}-scout-card.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl sm:max-w-sm p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-fredoka text-xl text-text-dark">
            Share {dog.name}&apos;s Card
          </DialogTitle>
        </DialogHeader>

        {/* Shareable card preview */}
        <div className="mx-6 mb-5 rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-warm-white">
          {/* Photo */}
          <div className="relative w-full h-44 bg-cream flex items-center justify-center overflow-hidden">
            {dog.photoUrl ? (
              <Image
                src={dog.photoUrl}
                alt={`Photo of ${dog.name}`}
                fill
                className="object-cover"
                unoptimized
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-14 h-14 opacity-15">
                <PawIcon color="var(--chewy-blue)" opacity={1} />
              </div>
            )}

            {dog.avatarUrl && (
              <div className="absolute bottom-2.5 right-2.5 w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-cream">
                <Image
                  src={dog.avatarUrl}
                  alt={`Avatar of ${dog.name}`}
                  fill
                  className="object-cover"
                  unoptimized
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {/* Scout watermark */}
            <div className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full">
              <div className="w-3.5 h-3.5">
                <PawIcon color="var(--chewy-blue)" opacity={1} />
              </div>
              <span className="font-fredoka text-xs font-semibold text-chewy-blue leading-none">
                Scout
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <PawIcon color="var(--chewy-orange)" opacity={1} />
              </div>
              <h3 className="font-fredoka text-2xl font-semibold text-text-dark leading-none">
                {dog.name}
              </h3>
              {dog.isSpayedNeutered && (
                <span className="font-nunito text-[0.7rem] font-bold uppercase tracking-widest text-chewy-orange bg-chewy-orange/10 px-2.5 py-0.5 rounded-full">
                  Fixed
                </span>
              )}
            </div>

            {details.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.map((d) => (
                  <div
                    key={d.label}
                    className="bg-cream rounded-lg px-3 py-1.5"
                  >
                    <p className="font-nunito text-[0.6rem] font-bold uppercase tracking-widest text-text-muted leading-none mb-0.5">
                      {d.label}
                    </p>
                    <p className="font-nunito text-xs font-semibold text-text-dark leading-none">
                      {d.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {dog.personality && (
              <p className="font-nunito text-xs text-text-mid italic leading-relaxed line-clamp-2">
                &ldquo;{dog.personality}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-2.5">
          {canNativeShare && (
            <Button
              onClick={handleNativeShare}
              className="w-full rounded-full bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold gap-2"
            >
              <Share2 className="size-4" />
              Share
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full rounded-full font-nunito font-bold border-black/10 gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Download className="size-4" />
                Download image
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full rounded-full font-nunito font-bold border-black/10 gap-2"
          >
            {isCopied ? (
              <>
                <Check className="size-4 text-green-600" />
                <span className="text-green-600">Link copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
