/**
 * Client-side hook for managing action logs stored in localStorage.
 * This separates client concerns from lib/ (server-side logic).
 */

'use client';

import type { ActionCategory, ActionLog, CareItem } from '@/types/views';

const STORAGE_KEY = 'scout_action_log';

// Default items per category
const DEFAULT_ITEMS: CareItem[] = [
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

export function useActionLog() {
  function getItemsByCategory(category: ActionCategory): CareItem[] {
    return DEFAULT_ITEMS.filter((item) => item.category === category);
  }

  function getAllLogs(): ActionLog[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as ActionLog[];
  }

  function getTodayLogs(): ActionLog[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const allLogs = JSON.parse(stored) as ActionLog[];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return allLogs.filter((log) => new Date(log.timestamp) >= todayStart);
  }

  function logAction(
    category: ActionCategory,
    itemName: string,
    photoUrl?: string,
    sessionId?: string
  ): ActionLog {
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

    const stored = localStorage.getItem(STORAGE_KEY);
    const allLogs = stored ? (JSON.parse(stored) as ActionLog[]) : [];

    allLogs.push(newLog);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));

    return newLog;
  }

  return {
    getItemsByCategory,
    getAllLogs,
    getTodayLogs,
    logAction,
  };
}
