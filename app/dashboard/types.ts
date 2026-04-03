export interface SitterSession {
  id: string;
  petId: string;
  sitterId: string;
  ownerId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dropOffTime: string | null;
  pickUpTime: string | null;
  role: 'full_access' | 'view_only';
  isActive: boolean;
  createdAt: string;
}
