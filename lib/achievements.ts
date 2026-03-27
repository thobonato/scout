import type {
  Achievement,
  AchievementId,
  ActionLog,
  FulfillmentState,
  StreakState,
  XPState,
} from "@/app/dog/[id]/home/types";

const STORAGE_KEY = "scout_achievements";
const LOGS_KEY = "scout_action_log";

interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first_feed",
    name: "First Meal",
    description: "Fed the dog for the first time",
    icon: "🍖",
  },
  {
    id: "first_play",
    name: "Playmate",
    description: "First play session",
    icon: "🎾",
  },
  {
    id: "first_meds",
    name: "Caretaker",
    description: "Gave medicine for the first time",
    icon: "💊",
  },
  {
    id: "streak_3",
    name: "On a Roll",
    description: "3-day perfect streak",
    icon: "🔥",
  },
  {
    id: "streak_7",
    name: "Dedicated",
    description: "7-day perfect streak",
    icon: "⭐",
  },
  {
    id: "streak_30",
    name: "Legendary",
    description: "30-day perfect streak",
    icon: "👑",
  },
  {
    id: "photo_pro",
    name: "Photo Pro",
    description: "Took 10 activity photos",
    icon: "📸",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Logged an action after 10pm",
    icon: "🦉",
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Logged an action before 7am",
    icon: "🌅",
  },
  {
    id: "perfect_day",
    name: "Perfect Day",
    description: "All meters at 100%",
    icon: "🏆",
  },
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reached level 5",
    icon: "🌟",
  },
  {
    id: "level_10",
    name: "Superstar",
    description: "Reached level 10",
    icon: "💎",
  },
];

function getAllLogs(): ActionLog[] {
  const stored = globalThis.localStorage?.getItem(LOGS_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as ActionLog[];
}

export function loadAchievements(): Achievement[] {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  const unlocked: Record<string, string> = stored ? JSON.parse(stored) : {};

  return ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlockedAt: unlocked[def.id],
  }));
}

interface CheckContext {
  logs: ActionLog[];
  xp: XPState;
  streak: StreakState;
  fulfillment: FulfillmentState;
}

export function checkAchievements(context: CheckContext): Achievement[] {
  const allLogs = getAllLogs();
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  const unlocked: Record<string, string> = stored ? JSON.parse(stored) : {};
  const now = new Date().toISOString();

  function tryUnlock(id: AchievementId, condition: boolean): void {
    if (condition && !unlocked[id]) {
      unlocked[id] = now;
    }
  }

  const hasFeed = allLogs.some((l) => l.category === "feed");
  const hasPlay = allLogs.some((l) => l.category === "play");
  const hasMeds = allLogs.some((l) => l.category === "medicine");
  const photoCount = allLogs.filter((l) => l.photoUrl).length;
  const hasNightOwl = allLogs.some(
    (l) => new Date(l.timestamp).getHours() >= 22,
  );
  const hasEarlyBird = allLogs.some(
    (l) => new Date(l.timestamp).getHours() < 7,
  );

  tryUnlock("first_feed", hasFeed);
  tryUnlock("first_play", hasPlay);
  tryUnlock("first_meds", hasMeds);
  tryUnlock("streak_3", context.streak.currentStreak >= 3);
  tryUnlock("streak_7", context.streak.currentStreak >= 7);
  tryUnlock("streak_30", context.streak.currentStreak >= 30);
  tryUnlock("photo_pro", photoCount >= 10);
  tryUnlock("night_owl", hasNightOwl);
  tryUnlock("early_bird", hasEarlyBird);
  tryUnlock(
    "perfect_day",
    context.fulfillment.hunger >= 100 &&
      context.fulfillment.exercise >= 100 &&
      context.fulfillment.medicine >= 100,
  );
  tryUnlock("level_5", context.xp.level >= 5);
  tryUnlock("level_10", context.xp.level >= 10);

  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(unlocked));

  return ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlockedAt: unlocked[def.id],
  }));
}
