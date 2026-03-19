export interface Pet {
  name: string;
  breed: string;
  age: string;
  avatarUrl: string | null;
}

export type ModalType = "feed" | "play" | "medicine" | null;

// FeedItem and ToyItem share the same shape — both have a category label
export interface CategoryItem {
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

export type AnyItem = CategoryItem | MedicineItem;
