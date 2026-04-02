/**
 * Database Queries Module
 *
 * Server-side database operations organized by domain.
 * All functions use Supabase and run on API routes.
 */

export { getTodayLogs, logActivity } from './logs';
export type {} from './logs';

export { createDailyTask, getDailyTasks, toggleTaskCompletion } from './tasks';
export type {} from './tasks';

export { getStreak, getStreaks, updateStreak } from './streaks';
export type {} from './streaks';

export { createPet, deletePet, getPet, getUserPets, updatePet } from './pets';
export type {} from './pets';

export { getUserSettings, updateUserSettings } from './settings';
export type {} from './settings';

export {
  createUserProfile,
  getProfileByEmail,
  getUserProfile,
} from './profiles';
export type {} from './profiles';

export {
  createInventoryItem,
  deleteInventoryItem,
  getInventory,
  getInventoryItem,
  updateInventoryItem,
} from './inventory';
export type {} from './inventory';

export {
  acceptSitterInvite,
  endSitterSession,
  getActiveSitterSessions,
  getSitterInvite,
  getSitterInviteByToken,
  getSitterInvitesForPet,
  revokeSitterInvite,
} from './sitters';
export type {} from './sitters';
