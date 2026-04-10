"use client";

import { AlertTriangle, Phone, Stethoscope } from "lucide-react";

interface SitterPetNotesProps {
  specialNotes?: string;
  emergencyContact?: string;
  vetInfo?: string;
}

export function SitterPetNotes({
  specialNotes,
  emergencyContact,
  vetInfo,
}: SitterPetNotesProps) {
  if (!specialNotes && !emergencyContact && !vetInfo) {
    return null;
  }

  return (
    <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        Important Info
      </h3>

      <div className="flex flex-col gap-3">
        {specialNotes && (
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={16}
              className="text-chewy-orange mt-0.5 flex-shrink-0"
            />
            <p className="font-nunito text-sm text-text-mid">{specialNotes}</p>
          </div>
        )}

        {emergencyContact && (
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-chewy-blue mt-0.5 flex-shrink-0" />
            <p className="font-nunito text-sm text-text-mid">
              {emergencyContact}
            </p>
          </div>
        )}

        {vetInfo && (
          <div className="flex items-start gap-3">
            <Stethoscope
              size={16}
              className="text-chewy-blue mt-0.5 flex-shrink-0"
            />
            <p className="font-nunito text-sm text-text-mid">{vetInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
