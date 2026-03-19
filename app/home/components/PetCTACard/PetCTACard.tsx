import { CheckBadge } from "../ItemModal/CheckBadge";
import type { ModalType } from "../../types";

interface PetCTACardProps {
  type: Exclude<ModalType, null>;
  onClick: () => void;
  isLogged: boolean;
}

const CTA_CONFIG: Record<
  Exclude<ModalType, null>,
  { label: string; emoji: string; hoverBorder: string }
> = {
  feed: {
    label: "Feed",
    emoji: "🍖",
    hoverBorder: "hover:border-chewy-orange/40",
  },
  play: {
    label: "Play",
    emoji: "🎾",
    hoverBorder: "hover:border-scout-blue/40",
  },
  medicine: {
    label: "Medicine",
    emoji: "💊",
    hoverBorder: "hover:border-text-muted/40",
  },
};

export function PetCTACard({ type, onClick, isLogged }: PetCTACardProps) {
  const config = CTA_CONFIG[type];

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`
          w-full bg-warm-white rounded-2xl p-4 shadow-sm border-2 border-black/5
          flex flex-col items-center gap-2 cursor-pointer
          hover:scale-[1.03] hover:shadow-md transition-all duration-150
          ${config.hoverBorder}
        `}
      >
        <span className="text-3xl">{config.emoji}</span>
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
