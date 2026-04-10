// ---------------------------------------------------------------------------
// Discount System — Client-side types
// ---------------------------------------------------------------------------

export type PointsSource =
  | "feed"
  | "play"
  | "medicine"
  | "streak_bonus"
  | "achievement_bonus";

export type TierId = "bronze" | "silver" | "gold" | "platinum";

export interface PointsEarning {
  id: string;
  source: PointsSource;
  label: string;
  points: number;
  earnedAt: string;
}

export interface Tier {
  id: TierId;
  name: string;
  icon: string;
  minPoints: number;
  discountPercent: number;
  color: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: "food" | "toys" | "health" | "accessories";
  icon: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface DiscountDashboardData {
  totalPoints: number;
  availablePoints: number;
  currentTier: TierId;
  nextTier: TierId | null;
  pointsToNextTier: number;
  lifetimeEarnings: number;
  recentEarnings: PointsEarning[];
  availableRewards: Reward[];
}
