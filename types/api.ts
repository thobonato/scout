/**
 * API Request and Response Types
 *
 * All HTTP endpoint types are defined here.
 * Organized by endpoint domain.
 */

// ============================================================================
// ACTIONS API (/api/actions)
// ============================================================================

import type { DailyLog } from '@/lib/types/database';

export interface LogActionRequest {
  petId: string;
  activityType: 'feeding' | 'walk' | 'medication' | 'play';
  notes?: string;
  photoUrl?: string;
  loggerId?: string;
}

export type LogActionResponse = { data: DailyLog } | { error: string };
export type GetActionsResponse = { data: DailyLog[] } | { error: string };

// ============================================================================
// TRACKER API (/api/tracker)
// ============================================================================

export interface TrackerTask {
  id: string;
  category: 'food' | 'exercise' | 'medicine';
  label: string;
  isCompleted: boolean;
  time?: string;
  note?: string;
}

export interface GetTrackerResponse {
  data?: {
    date: string;
    petName: string;
    tasks: TrackerTask[];
    streaks: Record<'food' | 'exercise' | 'medicine', number>;
  };
  error?: string;
}

export interface PatchTrackerRequest {
  taskId: string;
  isCompleted: boolean;
}

export interface PatchTrackerResponse {
  data?: { taskId: string; isCompleted: boolean };
  error?: string;
}

// ============================================================================
// FULFILLMENT API (/api/fulfillment)
// ============================================================================

export interface FulfillmentState {
  hunger: number;
  exercise: number;
  medicine: number;
}

export type GetFulfillmentResponse =
  | { data: FulfillmentState }
  | { error: string };

// ============================================================================
// AVATAR API (/api/avatar)
// ============================================================================

import type { GenerateAvatarResult } from '@/lib/avatar';

export interface AvatarRequest {
  photoDataUrl: string;
}

export type AvatarResponse = { data: GenerateAvatarResult } | { error: string };

// ============================================================================
// PETS API (/api/pets)
// ============================================================================

import type { Pet } from '@/lib/types/database';

export interface CreatePetRequest {
  ownerId: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'unknown';
  weight?: number;
  avatarUrl?: string;
}

export interface UpdatePetRequest {
  petId: string;
  name?: string;
  breed?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'unknown';
  weight?: number;
  coatColor?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  personality?: string;
  medicalNotes?: string;
  isSpayedNeutered?: boolean;
  avatarUrl?: string;
  healthContext?: string;
}

export interface PetResponse {
  data?: Pet;
  error?: string;
}

export interface PetsListResponse {
  data?: Pet[];
  error?: string;
}

export interface DeletePetResponse {
  success?: boolean;
  error?: string;
}

// ============================================================================
// INVENTORY API (/api/inventory)
// ============================================================================

import type { InventoryItem } from '@/lib/types/database';

export interface GetInventoryResponse {
  data?: InventoryItem[];
  error?: string;
}

export interface CreateInventoryRequest {
  petId: string;
  itemType: 'toy' | 'medicine' | 'food';
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface CreateInventoryResponse {
  data?: InventoryItem;
  error?: string;
}

export interface UpdateInventoryRequest {
  itemId: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  lastRestock?: boolean;
}

export interface UpdateInventoryResponse {
  data?: InventoryItem;
  error?: string;
}

export interface DeleteInventoryResponse {
  success?: boolean;
  error?: string;
}

// ============================================================================
// SETTINGS API (/api/settings)
// ============================================================================

import type { UserSettings } from '@/lib/types/database';

export interface SettingsResponse {
  data?: UserSettings;
  error?: string;
}

// ============================================================================
// SITTERS API (/api/sitters/*)
// ============================================================================

export interface AcceptInviteRequest {
  token: string;
  sitterId: string;
  sitterEmail?: string;
}

export interface AcceptInviteResponse {
  data?: {
    sessionId: string;
    message: string;
  };
  error?: string;
}

export interface SitterSessionData {
  id: string;
  pet_id: string;
  sitter_id: string;
  invite_id: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  permissions_scope: 'full_access' | 'view_only';
  created_at: string;
  updated_at: string;
}

export interface GetSessionsResponse {
  data?: SitterSessionData[];
  error?: string;
}

export interface EndSessionRequest {
  sessionId: string;
}

export interface EndSessionResponse {
  success?: boolean;
  error?: string;
}

// ============================================================================
// HEALTH INSIGHTS API (/api/health-insights)
// ============================================================================

export interface HealthInsights {
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  generatedAt: string;
}

export type GetHealthInsightsResponse =
  | { data: HealthInsights }
  | { error: string };
