import type { ActionCategory, XPState } from '@/types/views';

const STORAGE_KEY = 'scout_xp_state';

const XP_PER_ACTION: Record<ActionCategory, number> = {
  feed: 10,
  play: 15,
  medicine: 20,
};

const PHOTO_BONUS = 5;
const XP_PER_LEVEL = 50;

export function getXPForAction(
  category: ActionCategory,
  hasPhoto: boolean
): number {
  const base = XP_PER_ACTION[category];
  return hasPhoto ? base + PHOTO_BONUS : base;
}

function calculateLevel(totalXP: number): {
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
} {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
  return { level, xpInCurrentLevel, xpToNextLevel: XP_PER_LEVEL };
}

export function loadXPState(): XPState {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      totalXP: 0,
      level: 1,
      xpInCurrentLevel: 0,
      xpToNextLevel: XP_PER_LEVEL,
    };
  }

  const data = JSON.parse(stored) as { totalXP: number };
  const { level, xpInCurrentLevel, xpToNextLevel } = calculateLevel(
    data.totalXP
  );

  return { totalXP: data.totalXP, level, xpInCurrentLevel, xpToNextLevel };
}

export function awardXP(category: ActionCategory, hasPhoto: boolean): XPState {
  const current = loadXPState();
  const earned = getXPForAction(category, hasPhoto);
  const newTotal = current.totalXP + earned;

  globalThis.localStorage?.setItem(
    STORAGE_KEY,
    JSON.stringify({ totalXP: newTotal })
  );

  const { level, xpInCurrentLevel, xpToNextLevel } = calculateLevel(newTotal);
  return { totalXP: newTotal, level, xpInCurrentLevel, xpToNextLevel };
}
