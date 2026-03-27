import Image from "next/image";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import type { DogProfile } from "@/app/create-dog/types";

interface DogCardProps {
  dog: DogProfile;
}

export function DogCard({ dog }: DogCardProps) {
  const hasAvatar = Boolean(dog.avatarUrl);

  return (
    <div className="bg-warm-white rounded-2xl shadow-md border border-black/5 overflow-hidden">
      {/* Photo section */}
      <div className="relative w-full h-64 bg-cream flex items-center justify-center overflow-hidden">
        {dog.photoUrl ? (
          <Image
            src={dog.photoUrl}
            alt={`Photo of ${dog.name}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 opacity-15">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-nunito text-sm text-text-muted/50">
              No photo
            </span>
          </div>
        )}

        {/* Avatar overlay */}
        {hasAvatar && (
          <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-cream">
            <Image
              src={dog.avatarUrl!}
              alt={`Avatar of ${dog.name}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="px-8 pt-6 pb-8 flex flex-col gap-5">
        {/* Name row */}
        <div className="flex items-center gap-3">
          <div className="animate-wag w-7 h-7">
            <PawIcon color="var(--chewy-orange)" opacity={1} />
          </div>
          <h2 className="font-fredoka text-3xl font-semibold text-text-dark">
            {dog.name}
          </h2>
          {dog.isSpayedNeutered && (
            <span className="font-nunito text-xs font-bold uppercase tracking-widest text-chewy-orange bg-chewy-orange/10 px-3 py-1 rounded-full">
              Fixed
            </span>
          )}
        </div>

        {/* Primary details */}
        <div className="grid grid-cols-3 gap-3">
          <DetailCell label="Breed" value={dog.breed} />
          <DetailCell
            label="Age"
            value={
              dog.age
                ? `${dog.age} ${Number(dog.age) === 1 ? "yr" : "yrs"}`
                : undefined
            }
          />
          <DetailCell label="Size" value={formatSize(dog.size)} />
        </div>

        {/* Secondary details */}
        <div className="grid grid-cols-3 gap-3">
          <DetailCell
            label="Weight"
            value={dog.weight ? `${dog.weight} lbs` : undefined}
          />
          <DetailCell label="Gender" value={formatGender(dog.gender)} />
          <DetailCell label="Coat" value={dog.coatColor} />
        </div>

        {/* Personality */}
        {dog.personality && (
          <div className="bg-cream rounded-xl px-5 py-4">
            <p className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
              Personality
            </p>
            <p className="font-nunito text-sm font-semibold text-text-dark leading-relaxed">
              {dog.personality}
            </p>
          </div>
        )}

        {/* Medical notes */}
        {dog.medicalNotes && (
          <div className="bg-chewy-orange/5 rounded-xl px-5 py-4 border border-chewy-orange/10">
            <p className="font-nunito text-xs font-bold text-chewy-orange uppercase tracking-widest mb-1">
              Medical Notes
            </p>
            <p className="font-nunito text-sm font-semibold text-text-dark leading-relaxed">
              {dog.medicalNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailCellProps {
  label: string;
  value: string | undefined;
}

function DetailCell({ label, value }: DetailCellProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="bg-cream rounded-xl px-4 py-3">
      <p className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-nunito text-sm font-semibold text-text-dark">
        {value}
      </p>
    </div>
  );
}

function formatSize(size: string | undefined): string | undefined {
  if (!size) {
    return undefined;
  }

  const labels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "extra-large": "XL",
  };

  return labels[size] || size;
}

function formatGender(gender: string | undefined): string | undefined {
  if (!gender || gender === "unknown") {
    return undefined;
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}
