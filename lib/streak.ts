import type { FulfillmentState, StreakState } from "@/app/dog/[id]/home/types";

const STORAGE_KEY = "scout_streak_state";

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString("en-CA");
}

export function loadStreakState(): StreakState {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!stored) {
    return { currentStreak: 0, lastPerfectDate: null };
  }

  return JSON.parse(stored) as StreakState;
}

export function checkAndUpdateStreak(
  fulfillment: FulfillmentState,
): StreakState {
  const isPerfect =
    fulfillment.hunger >= 100 &&
    fulfillment.exercise >= 100 &&
    fulfillment.medicine >= 100;

  if (!isPerfect) {
    return loadStreakState();
  }

  const current = loadStreakState();
  const today = getTodayDate();

  if (current.lastPerfectDate === today) {
    return current;
  }

  const isConsecutive = current.lastPerfectDate === getYesterdayDate();
  const newStreak = isConsecutive ? current.currentStreak + 1 : 1;

  const updated: StreakState = {
    currentStreak: newStreak,
    lastPerfectDate: today,
  };

  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
