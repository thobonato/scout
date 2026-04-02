/**
 * Action/Activity utility functions
 *
 * Note: localStorage operations have been moved to hooks/useActionLog.ts
 * This module contains pure logic and constants.
 *
 * DEPRECATED: Use hooks/useActionLog for getAllLogs, getTodayLogs, logAction
 * This module is kept for backwards compatibility and constants only.
 */

import type { ActionCategory, ActionLog, CareItem } from '@/types/views';

// Default items per category
export const DEFAULT_CARE_ITEMS: CareItem[] = [
  { id: 'feed-kibble', category: 'feed', name: 'Kibble', icon: '🍖' },
  { id: 'feed-wet', category: 'feed', name: 'Wet Food', icon: '🥫' },
  { id: 'feed-treat', category: 'feed', name: 'Treat', icon: '🦴' },
  { id: 'feed-custom', category: 'feed', name: 'Custom', icon: '🍽️' },
  { id: 'play-fetch', category: 'play', name: 'Fetch', icon: '🎾' },
  { id: 'play-tug', category: 'play', name: 'Tug', icon: '🪢' },
  { id: 'play-walk', category: 'play', name: 'Walk', icon: '🚶' },
  { id: 'play-free', category: 'play', name: 'Free Play', icon: '🐕' },
  { id: 'med-morning', category: 'medicine', name: 'Morning Meds', icon: '💊' },
  { id: 'med-evening', category: 'medicine', name: 'Evening Meds', icon: '💊' },
  {
    id: 'med-supplement',
    category: 'medicine',
    name: 'Supplement',
    icon: '🧴',
  },
  { id: 'med-custom', category: 'medicine', name: 'Custom', icon: '🩺' },
];

export function getItemsByCategory(category: ActionCategory): CareItem[] {
  return DEFAULT_CARE_ITEMS.filter((item) => item.category === category);
}

// Backwards compatibility - these are placeholder and should use hooks/useActionLog instead
export function getAllLogs(): ActionLog[] {
  console.warn(
    'getAllLogs from lib/actions is deprecated. Use hooks/useActionLog instead.'
  );
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = globalThis.localStorage?.getItem('scout_action_log');
  if (!stored) {
    return [];
  }
  return JSON.parse(stored) as ActionLog[];
}

export function getTodayLogs(): ActionLog[] {
  console.warn(
    'getTodayLogs from lib/actions is deprecated. Use hooks/useActionLog instead.'
  );
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = globalThis.localStorage?.getItem('scout_action_log');
  if (!stored) {
    return [];
  }

  const allLogs = JSON.parse(stored) as ActionLog[];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return allLogs.filter((log) => new Date(log.timestamp) >= todayStart);
}

export function logAction(
  category: ActionCategory,
  itemName: string,
  photoUrl?: string,
  sessionId?: string
): ActionLog {
  console.warn(
    'logAction from lib/actions is deprecated. Use hooks/useActionLog instead.'
  );
  const newLog: ActionLog = {
    id: crypto.randomUUID(),
    category,
    itemName,
    timestamp: new Date().toISOString(),
    photoUrl,
    sessionId,
  };

  if (typeof window === 'undefined') {
    return newLog;
  }

  const stored = globalThis.localStorage?.getItem('scout_action_log');
  const allLogs = stored ? (JSON.parse(stored) as ActionLog[]) : [];

  allLogs.push(newLog);
  globalThis.localStorage?.setItem('scout_action_log', JSON.stringify(allLogs));

  return newLog;
}
