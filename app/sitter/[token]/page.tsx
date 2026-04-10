"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { AvatarDisplay } from "@/app/dog/[id]/home/components/AvatarDisplay/AvatarDisplay";
import { MoodBadge } from "@/app/dog/[id]/home/components/MoodBadge/MoodBadge";
import { FulfillmentMeters } from "@/app/dog/[id]/home/components/FulfillmentMeters/FulfillmentMeters";
import { deriveMood } from "@/lib/mood";
import { SitterSessionCard } from "./components/SitterSessionCard";
import { SitterProgressBar } from "./components/SitterProgressBar";
import { SitterRecentActivity } from "./components/SitterRecentActivity";
import { SitterPetNotes } from "./components/SitterPetNotes";
import { MOCK_LANDING } from "./mock-data";
import type { SitterLandingData } from "./types";

// ---------------------------------------------------------------------------
// Page — sitter landing (no auth, no owner nav)
// ---------------------------------------------------------------------------
export default function SitterLandingPage() {
  const params = useParams();
  const token = params.token as string;

  // TODO: replace with fetch(`/api/sitter/${token}`) when BE is ready
  const [data] = useState<SitterLandingData>({
    ...MOCK_LANDING,
    token,
  });

  // Map sitter fulfillment keys to owner FulfillmentState keys
  const fulfillmentForMeters = {
    hunger: data.fulfillment.food,
    exercise: data.fulfillment.exercise,
    medicine: data.fulfillment.medicine,
  };

  const mood = deriveMood(fulfillmentForMeters);

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-8 pb-12 gap-5 max-w-md mx-auto">
        {/* Header strip */}
        <div className="animate-fade-up w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-fredoka text-sm font-semibold text-chewy-blue">
              scout
            </span>
          </div>
          <span className="font-nunito text-xs font-bold text-chewy-orange bg-chewy-orange/10 px-3 py-1 rounded-full uppercase tracking-widest">
            Sitter View
          </span>
        </div>

        {/* Avatar + Name + Mood */}
        <div
          className="animate-pop-in flex flex-col items-center"
          style={{ animationDelay: "0.05s" }}
        >
          <AvatarDisplay
            name={data.pet.name}
            avatarUrl={data.pet.avatarUrl}
            photoUrl={data.pet.photoUrl}
            borderClass={mood.borderClass}
          />
          <div className="flex justify-center mt-2">
            <MoodBadge mood={mood} />
          </div>
        </div>

        {/* Session card */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.15s" }}
        >
          <SitterSessionCard
            label={data.session.label}
            startDate={data.session.startDate}
            endDate={data.session.endDate}
            dropOffTime={data.session.dropOffTime}
            pickUpTime={data.session.pickUpTime}
          />
        </div>

        {/* Fulfillment meters */}
        <div
          className="animate-fade-up w-full flex justify-center"
          style={{ animationDelay: "0.2s" }}
        >
          <FulfillmentMeters fulfillment={fulfillmentForMeters} />
        </div>

        {/* Overall progress */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.25s" }}
        >
          <SitterProgressBar
            completed={data.completedTasks}
            total={data.totalTasks}
          />
        </div>

        {/* Recent activity */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.3s" }}
        >
          <SitterRecentActivity entries={data.recentActivity} />
        </div>

        {/* Pet notes */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.35s" }}
        >
          <SitterPetNotes
            specialNotes={data.pet.specialNotes}
            emergencyContact={data.pet.emergencyContact}
            vetInfo={data.pet.vetInfo}
          />
        </div>

        {/* View Routine CTA */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href={`/sitter/${token}/routine`}
            className="w-full flex items-center justify-center gap-3 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            <ClipboardList className="w-5 h-5" />
            View Routine
          </Link>
        </div>
      </div>
    </div>
  );
}
