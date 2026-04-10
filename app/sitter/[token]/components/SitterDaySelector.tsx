"use client";

interface SitterDaySelectorProps {
  days: { date: string; dayLabel: string }[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

function shortLabel(dayLabel: string): string {
  // "Day 1 — Mon, Apr 7" → "Day 1"
  return dayLabel.split("—")[0].trim();
}

function dateLabel(dayLabel: string): string {
  // "Day 1 — Mon, Apr 7" → "Mon, Apr 7"
  const parts = dayLabel.split("—");
  return parts.length > 1 ? parts[1].trim() : "";
}

export function SitterDaySelector({
  days,
  selectedDate,
  onSelect,
}: SitterDaySelectorProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-min">
        {days.map((day) => {
          const isActive = day.date === selectedDate;

          return (
            <button
              key={day.date}
              onClick={() => onSelect(day.date)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl transition-colors flex-shrink-0 ${
                isActive
                  ? "bg-chewy-blue text-white shadow-sm"
                  : "bg-warm-white text-text-mid border border-black/5 hover:bg-cream"
              }`}
            >
              <span
                className={`font-nunito text-xs font-bold ${
                  isActive ? "text-white" : "text-text-dark"
                }`}
              >
                {shortLabel(day.dayLabel)}
              </span>
              <span
                className={`font-nunito text-[10px] ${
                  isActive ? "text-white/80" : "text-text-muted"
                }`}
              >
                {dateLabel(day.dayLabel)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
