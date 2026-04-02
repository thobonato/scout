"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { AvatarDisplay } from "./home/components/AvatarDisplay/AvatarDisplay";
import { MoodBadge } from "./home/components/MoodBadge/MoodBadge";
import { FloatingEmoji } from "./home/components/FloatingEmoji/FloatingEmoji";
import { ActionCTAs } from "./home/components/ActionCTAs/ActionCTAs";
import { ItemModal } from "./home/components/ItemModal/ItemModal";
import { XPBar } from "./home/components/XPBar/XPBar";
import { StreakBadge } from "./home/components/StreakBadge/StreakBadge";
import { FulfillmentMeters } from "./home/components/FulfillmentMeters/FulfillmentMeters";
import { ActivityLog } from "./home/components/ActivityLog/ActivityLog";
import { AchievementRow } from "./home/components/AchievementRow/AchievementRow";
import { getItemsByCategory, getTodayLogs, logAction } from "@/lib/actions";
import { calculateFulfillment } from "@/lib/fulfillment";
import { deriveMood } from "@/lib/mood";
import { loadXPState, awardXP } from "@/lib/xp";
import { loadStreakState, checkAndUpdateStreak } from "@/lib/streak";
import { loadAchievements, checkAchievements } from "@/lib/achievements";
import { loadDogProfile } from "@/lib/dog-profile";
import type { DogProfile } from "@/app/create-dog/types";
import type {
  ActionCategory,
  ActionLog,
  CareItem,
  FulfillmentState,
  XPState,
  StreakState,
  Achievement,
} from "./home/types";

function deriveLastActionTimes(
  logs: ActionLog[],
): Record<ActionCategory, string | null> {
  const result: Record<ActionCategory, string | null> = {
    feed: null,
    play: null,
    medicine: null,
  };

  for (const log of logs) {
    if (!result[log.category] || log.timestamp > result[log.category]!) {
      result[log.category] = log.timestamp;
    }
  }

  return result;
}

export default function PetHomePage() {
  const params = useParams();
  const dogId = params.id as string;

  const [dog] = useState<DogProfile | null>(() =>
    typeof window !== "undefined" ? loadDogProfile() : null,
  );
  const [logs, setLogs] = useState<ActionLog[]>(() =>
    typeof window !== "undefined" ? getTodayLogs() : [],
  );
  const [fulfillment, setFulfillment] = useState<FulfillmentState>(() =>
    calculateFulfillment(typeof window !== "undefined" ? getTodayLogs() : []),
  );
  const [xp, setXP] = useState<XPState>(() => loadXPState());
  const [streak, setStreak] = useState<StreakState>(() => loadStreakState());
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    loadAchievements(),
  );
  const [activeCategory, setActiveCategory] = useState<ActionCategory | null>(
    null,
  );
  const [celebrationClass, setCelebrationClass] = useState("");
  const [emojiTrigger, setEmojiTrigger] = useState(0);
  const [lastCategory, setLastCategory] = useState<ActionCategory | null>(null);

  const mood = deriveMood(fulfillment);
  const lastActionTimes = deriveLastActionTimes(logs);

  const handleAction = useCallback((category: ActionCategory) => {
    setActiveCategory(category);
  }, []);

  const handleConfirm = useCallback(
    (item: CareItem, photoUrl?: string) => {
      const newLog = logAction(item.category, item.name, photoUrl);
      const updatedLogs = [...logs, newLog];

      setLogs(updatedLogs);

      const newFulfillment = calculateFulfillment(updatedLogs);
      setFulfillment(newFulfillment);
      setActiveCategory(null);

      // XP — earned by the sitter
      const newXP = awardXP(item.category, Boolean(photoUrl));
      setXP(newXP);

      // Streak
      const newStreak = checkAndUpdateStreak(newFulfillment);
      setStreak(newStreak);

      // Achievements
      const updated = checkAchievements({
        logs: updatedLogs,
        xp: newXP,
        streak: newStreak,
        fulfillment: newFulfillment,
      });
      setAchievements(updated);

      // Floating emoji celebration
      setLastCategory(item.category);
      setEmojiTrigger((prev) => prev + 1);

      // Avatar celebration
      setCelebrationClass("animate-celebrate");
      setTimeout(() => setCelebrationClass(""), 600);
    },
    [logs],
  );

  const handleCloseModal = useCallback(() => {
    setActiveCategory(null);
  }, []);

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

  const modalItems = activeCategory ? getItemsByCategory(activeCategory) : [];

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-24 gap-6">
        {/* Top bar */}
        <div className="w-full max-w-md flex justify-between items-center">
          <Link
            href="/"
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Home
          </Link>
          <Link
            href={`/dog/${dogId}/profile`}
            className="font-nunito text-sm font-semibold text-chewy-blue hover:text-chewy-blue-dark transition-colors"
          >
            Profile
          </Link>
        </div>

        {/* Avatar + Mood + Floating emoji */}
        <div className="animate-pop-in relative">
          <AvatarDisplay
            name={dog.name}
            avatarUrl={dog.avatarUrl}
            photoUrl={dog.photoUrl}
            celebrationClass={celebrationClass}
            borderClass={mood.borderClass}
          />
          <div className="flex justify-center mt-2">
            <MoodBadge mood={mood} />
          </div>
          <FloatingEmoji category={lastCategory} trigger={emojiTrigger} />
        </div>

        {/* Streak */}
        <StreakBadge streak={streak} />

        {/* CTAs */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <ActionCTAs
            onAction={handleAction}
            lastActionTimes={lastActionTimes}
          />
        </div>

        {/* XP Bar */}
        <div
          className="animate-fade-up w-full flex justify-center"
          style={{ animationDelay: "0.3s" }}
        >
          <XPBar xp={xp} />
        </div>

        {/* Fulfillment meters */}
        <div
          className="animate-fade-up w-full flex justify-center"
          style={{ animationDelay: "0.4s" }}
        >
          <FulfillmentMeters fulfillment={fulfillment} />
        </div>

        {/* Activity log */}
        <div
          className="animate-fade-up w-full flex justify-center"
          style={{ animationDelay: "0.5s" }}
        >
          <ActivityLog logs={logs} />
        </div>

        {/* Achievements */}
        <div
          className="animate-fade-up w-full flex justify-center"
          style={{ animationDelay: "0.6s" }}
        >
          <AchievementRow achievements={achievements} />
        </div>
      </div>

      <BottomNav />

      {/* Item selection modal */}
      {activeCategory && (
        <ItemModal
          isOpen={Boolean(activeCategory)}
          category={activeCategory}
          items={modalItems}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
