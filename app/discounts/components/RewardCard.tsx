"use client";

import type { Reward } from "../types";

interface RewardCardProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: (id: string) => void;
}

export function RewardCard({ reward, canAfford, onRedeem }: RewardCardProps) {
  const isRedeemed = reward.isRedeemed;

  return (
    <div
      className={`bg-warm-white rounded-2xl p-4 shadow-sm border transition-shadow ${
        isRedeemed
          ? "border-chewy-blue/15 bg-chewy-blue/5"
          : "border-black/5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{reward.icon}</span>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-nunito text-sm font-bold ${
              isRedeemed ? "text-text-muted line-through" : "text-text-dark"
            }`}
          >
            {reward.title}
          </h4>
          <p className="font-nunito text-xs text-text-muted mt-0.5">
            {reward.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="font-fredoka text-sm font-semibold text-chewy-orange">
            {reward.pointsCost} pts
          </span>

          {isRedeemed ? (
            <span className="font-nunito text-[10px] font-bold text-chewy-blue uppercase tracking-widest">
              Redeemed
            </span>
          ) : (
            <button
              onClick={() => onRedeem(reward.id)}
              disabled={!canAfford}
              className={`font-nunito text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${
                canAfford
                  ? "bg-chewy-blue text-white hover:bg-chewy-blue-dark"
                  : "bg-black/5 text-text-muted cursor-not-allowed"
              }`}
            >
              Redeem
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
