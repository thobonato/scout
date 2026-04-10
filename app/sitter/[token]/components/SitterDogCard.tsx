"use client";

import Image from "next/image";
import { PawIcon } from "@/components/PawIcon/PawIcon";

interface SitterDogCardProps {
  name: string;
  breed: string;
  age: string;
  photoUrl: string;
  avatarUrl?: string;
}

export function SitterDogCard({
  name,
  breed,
  age,
  photoUrl,
  avatarUrl,
}: SitterDogCardProps) {
  const displayUrl = avatarUrl || photoUrl;

  return (
    <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex items-center gap-4">
        {/* Pet avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-chewy-blue/20 bg-cream flex-shrink-0">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-7 h-7 opacity-20">
                <PawIcon color="var(--chewy-blue)" opacity={1} />
              </div>
            </div>
          )}
        </div>

        {/* Pet info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-fredoka text-xl font-semibold text-text-dark">
            {name}
          </h2>
          <p className="font-nunito text-sm text-text-muted">
            {breed} &middot; {age}
          </p>
        </div>
      </div>
    </div>
  );
}
