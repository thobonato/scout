"use client";

import { useState } from "react";
import Link from "next/link";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { DogSummary } from "./components/DogSummary/DogSummary";
import { RoutineOverview } from "./components/RoutineOverview/RoutineOverview";
import { SitterLink } from "./components/SitterLink/SitterLink";
import { SitterActivityFeed } from "./components/SitterActivityFeed/SitterActivityFeed";
import { getAllLogs } from "@/lib/actions";
import { loadSitterSessions } from "@/lib/sitter-sessions";
import { loadDogProfile } from "@/lib/dog-profile";
import type { DogProfile } from "@/app/create-dog/types";
import type { ActionLog } from "@/app/dog/[id]/home/types";
import type { SitterSession } from "./types";

export default function DashboardPage() {
  const [dog] = useState<DogProfile | null>(() =>
    typeof window !== "undefined" ? loadDogProfile() : null,
  );
  const [logs] = useState<ActionLog[]>(() =>
    typeof window !== "undefined" ? getAllLogs() : [],
  );
  const [sessions] = useState<SitterSession[]>(() =>
    typeof window !== "undefined"
      ? loadSitterSessions()
          .filter((s) => s.dogId === "temp")
          .reverse()
      : [],
  );

  if (!dog) {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />

        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-4">
          <div className="w-12 h-12 opacity-30">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            No dog profile yet
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

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-28 gap-6 max-w-md mx-auto">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/"
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Home
          </Link>
          <h1 className="font-fredoka text-lg font-semibold text-text-dark">
            Dashboard
          </h1>
          <div className="w-12" />
        </div>

        {/* Dog summary */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.1s" }}
        >
          <DogSummary dog={dog} />
        </div>

        {/* Routine overview */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.2s" }}
        >
          <RoutineOverview />
        </div>

        {/* Sitter links */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.3s" }}
        >
          <SitterLink dogId="temp" />
        </div>

        {/* Sitter activity feed */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.4s" }}
        >
          <SitterActivityFeed logs={logs} sessions={sessions} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
