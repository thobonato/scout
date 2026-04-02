/**
 * Gamification Module
 *
 * Client-side game state management: XP, levels, streaks, achievements, mood.
 * All functions use localStorage (run on client only).
 */

export { checkAchievements, loadAchievements } from './achievements';
export { calculateFulfillment } from './fulfillment';
export { deriveMood } from './mood';
export { checkAndUpdateStreak, loadStreakState } from './streak';
export { awardXP, getXPForAction, loadXPState } from './xp';
