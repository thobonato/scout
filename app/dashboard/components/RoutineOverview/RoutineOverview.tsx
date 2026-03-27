import { Utensils, Dog, Pill, Clock } from "lucide-react";

interface RoutineItem {
  category: string;
  title: string;
  time: string;
  frequency: string;
}

// Placeholder routine items until the Routine Builder is ready
const PLACEHOLDER_ITEMS: RoutineItem[] = [
  { category: "food", title: "Breakfast", time: "7:00 AM", frequency: "Daily" },
  {
    category: "medication",
    title: "Morning Meds",
    time: "7:30 AM",
    frequency: "Daily",
  },
  {
    category: "walk",
    title: "Morning Walk",
    time: "8:00 AM",
    frequency: "Daily",
  },
  { category: "food", title: "Lunch", time: "12:00 PM", frequency: "Daily" },
  {
    category: "walk",
    title: "Afternoon Walk",
    time: "4:00 PM",
    frequency: "Daily",
  },
  { category: "food", title: "Dinner", time: "6:00 PM", frequency: "Daily" },
  {
    category: "medication",
    title: "Evening Meds",
    time: "8:00 PM",
    frequency: "As needed",
  },
];

const categoryIcons: Record<string, typeof Utensils> = {
  food: Utensils,
  medication: Pill,
  walk: Dog,
};

const categoryColors: Record<string, string> = {
  food: "text-chewy-orange",
  medication: "text-chewy-blue",
  walk: "text-chewy-blue",
};

export function RoutineOverview() {
  return (
    <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
          Daily Routine
        </h3>
        <span className="font-nunito text-xs font-semibold text-text-muted">
          {PLACEHOLDER_ITEMS.length} items
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {PLACEHOLDER_ITEMS.map((item) => {
          const Icon = categoryIcons[item.category] || Clock;
          const colorClass = categoryColors[item.category] || "text-text-mid";

          return (
            <div
              key={`${item.category}-${item.time}`}
              className="flex items-center gap-3 py-2"
            >
              <Icon size={18} className={colorClass} strokeWidth={2.5} />

              <div className="flex-1 min-w-0">
                <span className="font-nunito text-sm font-semibold text-text-dark block">
                  {item.title}
                </span>
                <span className="font-nunito text-xs text-text-muted">
                  {item.frequency}
                </span>
              </div>

              <span className="font-nunito text-xs font-bold text-text-mid">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-black/5">
        <p className="font-nunito text-xs text-text-muted/60 text-center">
          Routine Builder coming soon — these are sample items
        </p>
      </div>
    </div>
  );
}
