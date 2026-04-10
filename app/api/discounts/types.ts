// ---------------------------------------------------------------------------
// Discount System — API Contract (placeholder for backend team)
// ---------------------------------------------------------------------------
//
// The frontend for Chewy Rewards is built and running on mock data.
// Below are the endpoint shapes the UI expects. All type definitions
// live in @/app/discounts/types.ts.
//
// WHAT THE FRONTEND PROVISIONS FOR:
//
//   GET  /api/discounts/dashboard    → GetDashboardResponse
//   GET  /api/discounts/history      → GetHistoryResponse (paginated via limit/offset)
//   GET  /api/discounts/rewards      → GetRewardsResponse (filterable by category)
//   POST /api/discounts/redeem       → RedeemRewardResponse (body: { rewardId })
//
// The UI displays points-per-action rates and tier thresholds defined at
// the bottom of this file. If those change on the backend, update them
// here so the frontend stays in sync.
//
// Response convention: { data: <payload> } on success, { error: string } on failure.
//
// ---------------------------------------------------------------------------

import type {
  DiscountDashboardData,
  Reward,
  PointsEarning,
  TierId,
} from "@/app/discounts/types";

// GET /api/discounts/dashboard
// Returns the user's full discount dashboard state
export interface GetDashboardResponse {
  data: DiscountDashboardData;
}

// GET /api/discounts/history?limit=N&offset=N
// Returns paginated points earning history
export interface GetHistoryParams {
  limit?: number;
  offset?: number;
}

export interface GetHistoryResponse {
  data: PointsEarning[];
  total: number;
  hasMore: boolean;
}

// POST /api/discounts/redeem
// Redeems a reward using available points
export interface RedeemRewardRequest {
  rewardId: string;
}

export interface RedeemRewardResponse {
  data: {
    reward: Reward;
    remainingPoints: number;
    currentTier: TierId;
  };
}

// GET /api/discounts/rewards?category=food|toys|health|accessories
// Returns available rewards, optionally filtered
export interface GetRewardsParams {
  category?: Reward["category"];
}

export interface GetRewardsResponse {
  data: Reward[];
}

// ---------------------------------------------------------------------------
// Points earning rate (informational — backend owns the actual calculation)
// These are the rates the frontend displays to users.
// ---------------------------------------------------------------------------
export const POINTS_PER_ACTION = {
  feed: 5,
  play: 8,
  medicine: 10,
  streak_bonus: 25, // awarded per 7-day streak
  achievement_bonus: 50, // awarded per achievement unlock
} as const;

export const TIER_THRESHOLDS: Record<TierId, number> = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3500,
};
