import { CheckBadge } from "../ItemModal/CheckBadge";
import type { ModalType } from "../../types";

interface PetCTACardProps {
  type: Exclude<ModalType, null>;
  onClick: () => void;
  isLogged: boolean;
}

const CTA_CONFIG: Record<
  Exclude<ModalType, null>,
  { label: string; emoji: string; accentBg: string; accentBorder: string }
> = {
  feed: {
    label: "Feed",
    emoji: "🍖",
    accentBg: "bg-chewy-orange/10",
    accentBorder: "hover:border-chewy-orange/30",
  },
  play: {
    label: "Play",
    emoji: "🎾",
    accentBg: "bg-scout-blue/10",
    accentBorder: "hover:border-scout-blue/30",
  },
  medicine: {
    label: "Medicine",
    emoji: "💊",
    accentBg: "bg-text-muted/10",
    accentBorder: "hover:border-text-muted/30",
  },
};

export function PetCTACard({ type, onClick, isLogged }: PetCTACardProps) {
  const config = CTA_CONFIG[type];

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`
          w-full bg-white rounded-2xl p-5 shadow-md border border-black/[0.06]
          flex flex-col items-center gap-3 cursor-pointer
          hover:scale-[1.04] hover:shadow-lg transition-all duration-200
          ${config.accentBorder}
        `}
      >
        <div
          className={`w-14 h-14 rounded-xl ${config.accentBg} flex items-center justify-center`}
        >
          <span className="text-2xl">{config.emoji}</span>
        </div>
        <span className="font-nunito font-bold text-sm text-text-dark">
          {config.label}
        </span>
      </button>

      {isLogged && (
        <div className="absolute -top-1.5 -right-1.5 animate-pop-in">
          <CheckBadge />
        </div>
      )}
    </div>
  );
}
