interface DogDetailFieldsProps {
  personality: string;
  onPersonalityChange: (value: string) => void;
  medicalNotes: string;
  onMedicalNotesChange: (value: string) => void;
  isSpayedNeutered: boolean;
  onSpayedNeuteredChange: (value: boolean) => void;
  inputClasses: string;
}

export function DogDetailFields({
  personality,
  onPersonalityChange,
  medicalNotes,
  onMedicalNotesChange,
  isSpayedNeutered,
  onSpayedNeuteredChange,
  inputClasses,
}: DogDetailFieldsProps) {
  return (
    <>
      {/* Personality */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dog-personality"
          className="font-nunito text-sm font-bold text-text-dark"
        >
          Personality
        </label>
        <textarea
          id="dog-personality"
          rows={3}
          placeholder="e.g. Playful, loves fetch, shy around strangers"
          value={personality}
          onChange={(e) => onPersonalityChange(e.target.value)}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Medical notes */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dog-medical"
          className="font-nunito text-sm font-bold text-text-dark"
        >
          Medical Notes
        </label>
        <textarea
          id="dog-medical"
          rows={3}
          placeholder="e.g. Allergic to chicken, takes daily joint supplement"
          value={medicalNotes}
          onChange={(e) => onMedicalNotesChange(e.target.value)}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Spayed / Neutered */}
      <label
        htmlFor="dog-spayed"
        className="flex items-center gap-3 cursor-pointer"
      >
        <input
          id="dog-spayed"
          type="checkbox"
          checked={isSpayedNeutered}
          onChange={(e) => onSpayedNeuteredChange(e.target.checked)}
          className="w-5 h-5 rounded-lg border-black/10 accent-chewy-blue"
        />
        <span className="font-nunito text-sm font-bold text-text-dark">
          Spayed / Neutered
        </span>
      </label>
    </>
  );
}
