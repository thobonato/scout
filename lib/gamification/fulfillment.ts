import type { ActionLog, FulfillmentState } from '@/types/views';

// Daily goals per category (MVP: hardcoded)
const DAILY_GOALS = {
  feed: 3,
  play: 2,
  medicine: 1,
};

export function calculateFulfillment(todayLogs: ActionLog[]): FulfillmentState {
  const feedCount = todayLogs.filter((log) => log.category === 'feed').length;
  const playCount = todayLogs.filter((log) => log.category === 'play').length;
  const medCount = todayLogs.filter(
    (log) => log.category === 'medicine'
  ).length;

  return {
    hunger: Math.min(100, Math.round((feedCount / DAILY_GOALS.feed) * 100)),
    exercise: Math.min(100, Math.round((playCount / DAILY_GOALS.play) * 100)),
    medicine: Math.min(
      100,
      Math.round((medCount / DAILY_GOALS.medicine) * 100)
    ),
  };
}
