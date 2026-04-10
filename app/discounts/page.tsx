"use client";

import { useState } from "react";
import Link from "next/link";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { PointsSummaryCard } from "./components/PointsSummaryCard";
import { TierProgressBar } from "./components/TierProgressBar";
import { RewardCard } from "./components/RewardCard";
import { EarningHistory } from "./components/EarningHistory";
import type { DiscountDashboardData } from "./types";

// ---------------------------------------------------------------------------
// Mock data — replace with fetch("/api/discounts/dashboard") when BE is ready
// ---------------------------------------------------------------------------
const MOCK_DASHBOARD: DiscountDashboardData = {
  totalPoints: 720,
  availablePoints: 620,
  currentTier: "silver",
  nextTier: "gold",
  pointsToNextTier: 780,
  lifetimeEarnings: 720,
  recentEarnings: [
    {
      id: "e1",
      source: "feed",
      label: "Morning kibble",
      points: 5,
      earnedAt: "2026-04-09T07:15:00Z",
    },
    {
      id: "e2",
      source: "play",
      label: "Morning walk (30 min)",
      points: 8,
      earnedAt: "2026-04-09T08:30:00Z",
    },
    {
      id: "e3",
      source: "medicine",
      label: "Joint supplement",
      points: 10,
      earnedAt: "2026-04-09T09:00:00Z",
    },
    {
      id: "e4",
      source: "streak_bonus",
      label: "7-day care streak",
      points: 25,
      earnedAt: "2026-04-08T23:59:00Z",
    },
    {
      id: "e5",
      source: "achievement_bonus",
      label: "Unlocked: Dedicated",
      points: 50,
      earnedAt: "2026-04-08T23:59:00Z",
    },
    {
      id: "e6",
      source: "feed",
      label: "Evening kibble",
      points: 5,
      earnedAt: "2026-04-08T18:00:00Z",
    },
  ],
  availableRewards: [
    {
      id: "r1",
      title: "10% off Dry Food",
      description: "Any bag of dry dog food on Chewy",
      pointsCost: 200,
      category: "food",
      icon: "🍖",
      isRedeemed: false,
    },
    {
      id: "r2",
      title: "Free Bully Stick Pack",
      description: "6-pack of natural bully sticks",
      pointsCost: 350,
      category: "food",
      icon: "🦴",
      isRedeemed: false,
    },
    {
      id: "r3",
      title: "15% off Flea & Tick",
      description: "Flea & tick prevention treatments",
      pointsCost: 500,
      category: "health",
      icon: "💊",
      isRedeemed: false,
    },
    {
      id: "r4",
      title: "$5 off Any Toy",
      description: "One toy from the Chewy toy shop",
      pointsCost: 150,
      category: "toys",
      icon: "🎾",
      isRedeemed: false,
    },
    {
      id: "r5",
      title: "Free Bandana",
      description: "Seasonal Scout-branded bandana",
      pointsCost: 100,
      category: "accessories",
      icon: "🧣",
      isRedeemed: true,
      redeemedAt: "2026-04-05T12:00:00Z",
    },
  ],
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DiscountsPage() {
  // TODO: replace with useSWR or useEffect fetch to GET /api/discounts/dashboard
  const [data, setData] = useState<DiscountDashboardData>(MOCK_DASHBOARD);

  function handleRedeem(rewardId: string) {
    // TODO: POST /api/discounts/redeem { rewardId }
    setData((prev) => {
      const reward = prev.availableRewards.find((r) => r.id === rewardId);
      if (
        !reward ||
        reward.isRedeemed ||
        prev.availablePoints < reward.pointsCost
      ) {
        return prev;
      }

      return {
        ...prev,
        availablePoints: prev.availablePoints - reward.pointsCost,
        availableRewards: prev.availableRewards.map((r) =>
          r.id === rewardId
            ? { ...r, isRedeemed: true, redeemedAt: new Date().toISOString() }
            : r,
        ),
      };
    });
  }

  const activeRewards = data.availableRewards.filter((r) => !r.isRedeemed);
  const redeemedRewards = data.availableRewards.filter((r) => r.isRedeemed);

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-28 gap-5 max-w-md mx-auto">
        {/* Header */}
        <div className="animate-fade-up w-full flex items-center justify-between">
          <Link
            href="/dog/temp/profile"
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Profile
          </Link>
          <div className="flex items-center gap-[6px]">
            <div className="animate-wag w-5 h-5">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-fredoka text-sm font-semibold text-chewy-blue">
              scout
            </span>
          </div>
        </div>

        {/* Page title */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.05s" }}
        >
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            Chewy Rewards
          </h1>
          <p className="font-nunito text-sm text-text-muted mt-0.5">
            Earn points by caring for your pet, redeem for discounts
          </p>
        </div>

        {/* Points summary */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.1s" }}
        >
          <PointsSummaryCard
            availablePoints={data.availablePoints}
            lifetimeEarnings={data.lifetimeEarnings}
            currentTier={data.currentTier}
          />
        </div>

        {/* Tier progress */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.15s" }}
        >
          <TierProgressBar
            currentTier={data.currentTier}
            nextTier={data.nextTier}
            totalPoints={data.totalPoints}
            pointsToNextTier={data.pointsToNextTier}
          />
        </div>

        {/* How you earn */}
        <div
          className="animate-fade-up w-full bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
            How You Earn
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <EarnRate icon="🍖" label="Feed" points={5} />
            <EarnRate icon="🎾" label="Play" points={8} />
            <EarnRate icon="💊" label="Meds" points={10} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <EarnRate icon="🔥" label="7-day streak" points={25} />
            <EarnRate icon="🏆" label="Achievement" points={50} />
          </div>
        </div>

        {/* Available rewards */}
        {activeRewards.length > 0 && (
          <div
            className="animate-fade-up w-full"
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
              Available Rewards
            </h3>
            <div className="flex flex-col gap-2">
              {activeRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={data.availablePoints >= reward.pointsCost}
                  onRedeem={handleRedeem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Redeemed rewards */}
        {redeemedRewards.length > 0 && (
          <div
            className="animate-fade-up w-full"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
              Redeemed
            </h3>
            <div className="flex flex-col gap-2">
              {redeemedRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={false}
                  onRedeem={handleRedeem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Earning history */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.35s" }}
        >
          <EarningHistory earnings={data.recentEarnings} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface EarnRateProps {
  icon: string;
  label: string;
  points: number;
}

function EarnRate({ icon, label, points }: EarnRateProps) {
  return (
    <div className="flex flex-col items-center bg-cream/60 rounded-xl py-3 px-2">
      <span className="text-lg">{icon}</span>
      <span className="font-nunito text-[11px] font-bold text-text-mid mt-1">
        {label}
      </span>
      <span className="font-fredoka text-sm font-semibold text-chewy-blue">
        +{points}
      </span>
    </div>
  );
}
