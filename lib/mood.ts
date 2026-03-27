import type { FulfillmentState, MoodState } from "@/app/dog/[id]/home/types";

export function deriveMood(fulfillment: FulfillmentState): MoodState {
  const average =
    (fulfillment.hunger + fulfillment.exercise + fulfillment.medicine) / 3;

  if (fulfillment.hunger < 40) {
    return {
      mood: "hungry",
      emoji: "😋",
      label: "Hungry",
      borderClass: "border-chewy-orange",
    };
  }

  if (fulfillment.exercise < 40) {
    return {
      mood: "playful",
      emoji: "🐕",
      label: "Wants to play",
      borderClass: "border-chewy-blue",
    };
  }

  if (average < 30) {
    return {
      mood: "sleepy",
      emoji: "😴",
      label: "Sleepy",
      borderClass: "border-text-muted",
    };
  }

  return {
    mood: "happy",
    emoji: "😊",
    label: "Happy",
    borderClass: "border-chewy-blue",
  };
}
