"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Share2, Gift } from "lucide-react";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { DogCard } from "../components/DogCard/DogCard";
import { ShareCardModal } from "../components/ShareCardModal/ShareCardModal";
import { HealthInsights } from "./components/HealthInsights";
import { loadDogProfile } from "@/lib/dog-profile";
import type { DogProfile } from "@/app/create-dog/types";

export default function DogProfilePage() {
  const params = useParams();
  const dogId = params.id as string;
  const [dog] = useState<DogProfile | null>(() =>
    typeof window !== "undefined" ? loadDogProfile() : null,
  );
  const [isShareOpen, setIsShareOpen] = useState(false);

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

        <BottomNav />
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
            href={`/dog/${dogId}`}
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

        {/* Health Insights */}
        <div
          className="animate-fade-up w-full max-w-md mb-4"
          style={{ animationDelay: "0.45s" }}
        >
          <HealthInsights dog={dog} />
        </div>

        {/* Chewy Rewards link */}
        <div
          className="animate-fade-up w-full max-w-md"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            href="/discounts"
            className="flex items-center gap-4 bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-chewy-orange/10 text-chewy-orange">
              <Gift size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <span className="font-nunito text-sm font-bold text-text-dark block">
                Chewy Rewards
              </span>
              <span className="font-nunito text-xs text-text-muted">
                Earn points, unlock discounts
              </span>
            </div>
            <span className="font-nunito text-xs text-text-muted">
              &rsaquo;
            </span>
          </Link>
        </div>

        {/* Action buttons */}
        <div
          className="animate-fade-up w-full max-w-md flex flex-col gap-3"
          style={{ animationDelay: "0.55s" }}
        >
          <button
            onClick={() => setIsShareOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-chewy-orange hover:bg-chewy-orange-dark text-white font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            <Share2 className="w-5 h-5" />
            Share Card
          </button>

          <Link
            href={`/dog/${dogId}`}
            className="w-full flex items-center justify-center gap-3 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            <span className="w-5 h-5">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Go Home
          </Link>
        </div>
      </div>

      <ShareCardModal
        dog={dog}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
