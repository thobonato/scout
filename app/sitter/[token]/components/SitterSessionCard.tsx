"use client";

import { Calendar, Clock } from "lucide-react";

interface SitterSessionCardProps {
  label: string;
  startDate: string;
  endDate: string;
  dropOffTime?: string;
  pickUpTime?: string;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function SitterSessionCard({
  label,
  startDate,
  endDate,
  dropOffTime,
  pickUpTime,
}: SitterSessionCardProps) {
  return (
    <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <h3 className="font-fredoka text-lg font-semibold text-text-dark mb-3">
        {label}
      </h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-chewy-blue" />
          <span className="font-nunito text-sm text-text-mid">
            {formatDate(startDate)} &ndash; {formatDate(endDate)}
          </span>
        </div>

        {(dropOffTime || pickUpTime) && (
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-chewy-blue" />
            <span className="font-nunito text-sm text-text-mid">
              {dropOffTime && `Drop-off ${dropOffTime}`}
              {dropOffTime && pickUpTime && " · "}
              {pickUpTime && `Pick-up ${pickUpTime}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
