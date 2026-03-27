import type { FulfillmentState } from "../../types";

interface FulfillmentMetersProps {
  fulfillment: FulfillmentState;
}

const meters = [
  {
    key: "hunger" as const,
    label: "Hunger",
    icon: "🍖",
    color: "bg-chewy-orange",
  },
  {
    key: "exercise" as const,
    label: "Exercise",
    icon: "🎾",
    color: "bg-chewy-blue",
  },
  {
    key: "medicine" as const,
    label: "Medicine",
    icon: "💊",
    color: "bg-chewy-orange",
  },
];

export function FulfillmentMeters({ fulfillment }: FulfillmentMetersProps) {
  return (
    <div className="w-full max-w-md bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        Fulfillment
      </h3>

      <div className="flex flex-col gap-4">
        {meters.map((meter) => {
          const value = fulfillment[meter.key];

          return (
            <div key={meter.key} className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">{meter.icon}</span>

              <div className="flex-1">
                <div className="h-3 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meter.color}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>

              <span className="font-nunito text-sm font-bold text-text-mid w-12 text-right">
                {value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
