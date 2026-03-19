import { Skeleton } from "@/components/ui/skeleton";
import type { Pet } from "../../types";

interface PetAvatarProps {
  pet: Pet;
}

export function PetAvatar({ pet }: PetAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* TODO: Phase 2 — replace skeleton with <Image> when pet.avatarUrl is populated */}
      <Skeleton className="w-32 h-32 rounded-full" />

      <p className="font-nunito text-xs text-text-muted">
        Generating your avatar...
      </p>

      <h2 className="font-fredoka text-2xl font-bold text-text-dark">
        {pet.name}
      </h2>

      <p className="font-nunito text-sm text-text-muted">
        {pet.breed} · {pet.age}
      </p>
    </div>
  );
}
