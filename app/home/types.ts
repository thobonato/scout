export interface Pet {
  name: string;
  breed: string;
  age: string;
  avatarUrl: string | null;
}

export type ModalType = "feed" | "play" | "medicine" | null;

export interface FeedItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface ToyItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  emoji: string;
  notes: string;
}

export type AnyItem = FeedItem | ToyItem | MedicineItem;
