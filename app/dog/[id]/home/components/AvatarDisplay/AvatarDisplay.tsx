import Image from "next/image";
import { PawIcon } from "@/components/PawIcon/PawIcon";

interface AvatarDisplayProps {
  name: string;
  avatarUrl?: string;
  photoUrl?: string;
  celebrationClass?: string;
  borderClass?: string;
}

export function AvatarDisplay({
  name,
  avatarUrl,
  photoUrl,
  celebrationClass,
  borderClass,
}: AvatarDisplayProps) {
  const displayUrl = avatarUrl || photoUrl;
  const border = borderClass || "border-white";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative w-48 h-48 rounded-full overflow-hidden border-4 shadow-lg bg-cream animate-breathe transition-colors duration-700 ${border} ${celebrationClass || ""}`}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={`Avatar of ${name}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 opacity-20">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-nunito text-xs text-text-muted/50 text-center px-4">
              Upload a photo to meet your pup!
            </span>
          </div>
        )}
      </div>

      <h2 className="font-fredoka text-2xl font-semibold text-text-dark">
        {name}
      </h2>
    </div>
  );
}
