import { Skeleton } from "@/components/ui/skeleton";
import type { Pet } from "../../types";

interface PetAvatarProps {
  pet: Pet;
}

export function PetAvatar({ pet }: PetAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* TODO: Phase 2 — replace skeleton with <Image> when pet.avatarUrl is populated */}
      <div className="relative">
        <Skeleton className="w-28 h-28 rounded-full" />
        <div className="absolute inset-0 rounded-full border-4 border-scout-blue/15" />
      </div>

      <div className="flex flex-col items-center gap-1 mt-2">
        <h2 className="font-fredoka text-2xl font-bold text-text-dark">
          {pet.name}
        </h2>
        <p className="font-nunito text-sm text-text-muted">
          {pet.breed} · {pet.age}
        </p>
        <span className="inline-flex items-center gap-1.5 mt-1 font-nunito text-xs text-scout-blue bg-scout-blue/8 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-scout-blue animate-pulse" />
          Generating avatar...
        </span>
      </div>
    </div>
  );
}
