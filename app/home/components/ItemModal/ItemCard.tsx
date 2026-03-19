import type { AnyItem } from "../../types";

interface ItemCardProps {
  item: AnyItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function ItemCard({ item, isSelected, onToggle }: ItemCardProps) {
  const subtitle = "category" in item ? item.category : item.notes;

  return (
    <div className="relative">
      <button
        onClick={() => onToggle(item.id)}
        className={`
          w-full bg-warm-white rounded-2xl p-4 border-2 cursor-pointer transition-all duration-150
          flex flex-col items-center gap-1 text-center
          ${isSelected ? "border-scout-blue bg-scout-blue/5" : "border-transparent hover:border-scout-blue/20"}
        `}
      >
        <span className="text-4xl">{item.emoji}</span>
        <span className="font-nunito text-sm font-bold text-text-dark leading-tight">
          {item.name}
        </span>
        <span className="font-nunito text-xs text-text-muted">{subtitle}</span>
      </button>

      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 animate-pop-in">
          <div className="w-5 h-5 rounded-full bg-scout-blue flex items-center justify-center">
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
