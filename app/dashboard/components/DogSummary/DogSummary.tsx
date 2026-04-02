import { PawIcon } from '@/components/PawIcon/PawIcon';
import type { DogProfile } from '@/types/views';
import Image from 'next/image';
import Link from 'next/link';

interface DogSummaryProps {
  dog: DogProfile;
}

export function DogSummary({ dog }: DogSummaryProps) {
  const displayUrl = dog.avatarUrl || dog.photoUrl;

  return (
    <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex items-center gap-5">
        {/* Photo */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-chewy-blue/20 bg-cream flex-shrink-0">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={dog.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 opacity-20">
                <PawIcon color="var(--chewy-blue)" opacity={1} />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-fredoka text-2xl font-semibold text-text-dark">
            {dog.name}
          </h2>
          <p className="font-nunito text-sm text-text-mid">
            {dog.breed}
            {dog.age
              ? ` · ${dog.age} ${Number(dog.age) === 1 ? 'yr' : 'yrs'}`
              : ''}
          </p>
        </div>

        {/* View profile link */}
        <Link
          href="/dog/temp/profile"
          className="font-nunito text-xs font-bold text-chewy-blue hover:text-chewy-blue-dark transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
