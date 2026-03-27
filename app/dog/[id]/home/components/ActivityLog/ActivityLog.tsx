import Image from "next/image";
import type { ActionLog } from "../../types";

interface ActivityLogProps {
  logs: ActionLog[];
}

const categoryIcons: Record<string, string> = {
  feed: "🍖",
  play: "🎾",
  medicine: "💊",
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ActivityLog({ logs }: ActivityLogProps) {
  const recentLogs = logs.slice(-5).reverse();

  return (
    <div className="w-full max-w-md bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        Today&apos;s Activity
      </h3>

      {recentLogs.length === 0 ? (
        <p className="font-nunito text-sm text-text-muted/60 text-center py-4">
          No activity yet today. Tap a button above to get started!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-2">
              <span className="text-lg">
                {categoryIcons[log.category] || "📋"}
              </span>

              <div className="flex-1 min-w-0">
                <span className="font-nunito text-sm font-semibold text-text-dark block">
                  {log.itemName}
                </span>
                <span className="font-nunito text-xs text-text-muted">
                  {formatTime(log.timestamp)}
                </span>
              </div>

              {log.photoUrl && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-black/5 flex-shrink-0">
                  <Image
                    src={log.photoUrl}
                    alt={`${log.itemName} photo`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {logs.length > 5 && (
        <p className="font-nunito text-xs font-semibold text-chewy-blue text-center mt-3 cursor-pointer">
          See all ({logs.length})
        </p>
      )}
    </div>
  );
}
