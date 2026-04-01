export type SitterRole = "full_access" | "view_only";

export interface SitterInvitePayload {
  email: string;
  role: SitterRole;
  petId: string;
}

export interface NotificationSettings {
  dailyReminders: boolean;
  missedTaskAlerts: boolean;
  sitterUpdates: boolean;
  weeklyDigest: boolean;
}

export interface SettingsFormValues {
  ownerName: string;
  email: string;
  notifications: NotificationSettings;
}
