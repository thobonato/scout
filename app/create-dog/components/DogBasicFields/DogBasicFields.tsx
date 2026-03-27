import type { DogGender, DogSize } from "../../types";

interface DogBasicFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  breed: string;
  onBreedChange: (value: string) => void;
  age: string;
  onAgeChange: (value: string) => void;
  weight: string;
  onWeightChange: (value: string) => void;
  gender: DogGender;
  onGenderChange: (value: DogGender) => void;
  size: DogSize;
  onSizeChange: (value: DogSize) => void;
  coatColor: string;
  onCoatColorChange: (value: string) => void;
  inputClasses: string;
}

export function DogBasicFields({
  name,
  onNameChange,
  breed,
  onBreedChange,
  age,
  onAgeChange,
  weight,
  onWeightChange,
  gender,
  onGenderChange,
  size,
  onSizeChange,
  coatColor,
  onCoatColorChange,
  inputClasses,
}: DogBasicFieldsProps) {
  const selectClasses = `${inputClasses} appearance-none`;

  return (
    <>
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dog-name"
          className="font-nunito text-sm font-bold text-text-dark"
        >
          Name *
        </label>
        <input
          id="dog-name"
          type="text"
          placeholder="What's your dog's name?"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Breed */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dog-breed"
          className="font-nunito text-sm font-bold text-text-dark"
        >
          Breed *
        </label>
        <input
          id="dog-breed"
          type="text"
          placeholder="e.g. Golden Retriever"
          value={breed}
          onChange={(e) => onBreedChange(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Age + Weight row */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label
            htmlFor="dog-age"
            className="font-nunito text-sm font-bold text-text-dark"
          >
            Age (years)
          </label>
          <input
            id="dog-age"
            type="number"
            min="0"
            max="30"
            placeholder="e.g. 3"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label
            htmlFor="dog-weight"
            className="font-nunito text-sm font-bold text-text-dark"
          >
            Weight (lbs)
          </label>
          <input
            id="dog-weight"
            type="number"
            min="0"
            max="300"
            placeholder="e.g. 55"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Gender + Size row */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label
            htmlFor="dog-gender"
            className="font-nunito text-sm font-bold text-text-dark"
          >
            Gender
          </label>
          <select
            id="dog-gender"
            value={gender}
            onChange={(e) => onGenderChange(e.target.value as DogGender)}
            className={selectClasses}
          >
            <option value="unknown">Not specified</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label
            htmlFor="dog-size"
            className="font-nunito text-sm font-bold text-text-dark"
          >
            Size
          </label>
          <select
            id="dog-size"
            value={size}
            onChange={(e) => onSizeChange(e.target.value as DogSize)}
            className={selectClasses}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
      </div>

      {/* Coat color */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dog-coat"
          className="font-nunito text-sm font-bold text-text-dark"
        >
          Coat Color
        </label>
        <input
          id="dog-coat"
          type="text"
          placeholder="e.g. Golden, Black & Tan"
          value={coatColor}
          onChange={(e) => onCoatColorChange(e.target.value)}
          className={inputClasses}
        />
      </div>
    </>
  );
}
