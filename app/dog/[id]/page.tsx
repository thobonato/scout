"use client";

import { useState } from "react";
import Link from "next/link";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomStrip } from "@/components/BottomStrip/BottomStrip";
import { DogCard } from "./components/DogCard/DogCard";
import type { DogProfile } from "@/app/create-dog/types";

function loadDogProfile(): DogProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("scout_dog_profile");

  if (!stored) {
    return null;
  }

  return JSON.parse(stored) as DogProfile;
}

export default function DogProfilePage() {
  const [dog] = useState<DogProfile | null>(loadDogProfile);

  if (!dog) {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />

        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-4">
          <div className="w-12 h-12 opacity-30">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            No dog profile found
          </h1>
          <p className="font-nunito text-base text-text-mid max-w-sm">
            Create a profile for your pup to get started.
          </p>
          <Link
            href="/create-dog"
            className="inline-flex items-center gap-2 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors shadow-md"
          >
            <span className="w-4 h-4">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Create Profile
          </Link>
        </div>

        <BottomStrip />
      </div>
    );
  }

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-12 pb-24">
        {/* Back link */}
        <div
          className="animate-fade-up w-full max-w-md mb-8"
          style={{ animationDelay: "0.1s" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Home
          </Link>
        </div>

        {/* Success badge */}
        <div
          className="animate-fade-up mb-6"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="font-nunito text-[0.85rem] font-bold tracking-[0.18em] uppercase text-chewy-orange bg-chewy-orange/10 border-[1.5px] border-chewy-orange/25 px-[14px] py-[4px] rounded-full">
            Profile Created
          </span>
        </div>

        {/* Dog card */}
        <div
          className="animate-pop-in w-full max-w-md mb-8"
          style={{ animationDelay: "0.35s" }}
        >
          <DogCard dog={dog} />
        </div>

        {/* Action buttons */}
        <div
          className="animate-fade-up w-full max-w-md flex flex-col gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Add Routine - placeholder */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 bg-chewy-blue/15 text-chewy-blue font-nunito font-bold px-8 py-5 rounded-full cursor-not-allowed text-base"
          >
            <span className="w-5 h-5">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </span>
            Add Routine
            <span className="font-nunito text-xs font-semibold text-chewy-blue/50 ml-auto">
              Coming Soon
            </span>
          </button>

          {/* Share with Sitter - placeholder */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 border-2 border-chewy-orange/25 text-chewy-orange/50 font-nunito font-bold px-8 py-5 rounded-full cursor-not-allowed text-base"
          >
            Share with Sitter
            <span className="font-nunito text-xs font-semibold text-chewy-orange/35 ml-auto">
              Coming Soon
            </span>
          </button>
        </div>
      </div>

      <BottomStrip />
    </div>
  );
}
