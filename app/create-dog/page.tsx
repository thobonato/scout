"use client";

import Link from "next/link";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomStrip } from "@/components/BottomStrip/BottomStrip";
import { DogProfileForm } from "./components/DogProfileForm/DogProfileForm";

export default function CreateDogPage() {
  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      {/* Content */}
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
            &larr; Back
          </Link>
        </div>

        {/* Header */}
        <div
          className="animate-fade-up flex flex-col items-center gap-3 mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="animate-wag w-10 h-10">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-3xl font-semibold text-text-dark">
            Create Dog Profile
          </h1>
          <p className="font-nunito text-base text-text-mid max-w-sm text-center leading-relaxed">
            Tell us about your pup so we can set up their care routine.
          </p>
        </div>

        {/* Form card */}
        <div
          className="animate-fade-up w-full max-w-md"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="bg-warm-white rounded-2xl p-8 shadow-sm border border-black/5">
            <DogProfileForm />
          </div>
        </div>
      </div>

      <BottomStrip />
    </div>
  );
}
