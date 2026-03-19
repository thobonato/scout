import type { Pet, FeedItem, ToyItem, MedicineItem } from "./types";

export const mockPet: Pet = {
  name: "Biscuit",
  breed: "Golden Retriever",
  age: "2 years",
  avatarUrl: null,
};

export const feedItems: FeedItem[] = [
  { id: "f1", name: "Chicken & Rice", emoji: "🍗", category: "Dry Food" },
  { id: "f2", name: "Salmon Pâté", emoji: "🐟", category: "Wet Food" },
  { id: "f3", name: "Peanut Butter Treat", emoji: "🥜", category: "Treats" },
  { id: "f4", name: "Turkey Bites", emoji: "🦃", category: "Dry Food" },
  { id: "f5", name: "Beef Stew", emoji: "🥩", category: "Wet Food" },
  { id: "f6", name: "Sweet Potato Chew", emoji: "🍠", category: "Treats" },
];

export const toyItems: ToyItem[] = [
  { id: "t1", name: "Rope Tugger", emoji: "🪢", category: "Tug Toys" },
  { id: "t2", name: "Tennis Ball", emoji: "🎾", category: "Fetch" },
  { id: "t3", name: "Squeaky Duck", emoji: "🦆", category: "Squeaky" },
  { id: "t4", name: "Puzzle Feeder", emoji: "🧩", category: "Interactive" },
  { id: "t5", name: "Frisbee", emoji: "🥏", category: "Fetch" },
  { id: "t6", name: "Chew Bone", emoji: "🦴", category: "Chew Toys" },
];

export const medicineItems: MedicineItem[] = [
  { id: "m1", name: "Heartworm Pill", emoji: "💊", notes: "Monthly" },
  { id: "m2", name: "Flea Treatment", emoji: "🧴", notes: "Monthly" },
  { id: "m3", name: "Joint Supplement", emoji: "🌿", notes: "Daily" },
  { id: "m4", name: "Probiotic", emoji: "🫙", notes: "Daily" },
];
