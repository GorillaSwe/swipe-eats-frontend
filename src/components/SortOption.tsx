import React from "react";

type SortOptionProps = {
  value: string;
  label: string;
  isSelected: boolean;
  onOptionChange: (value: string) => void;
};

const SortOption: React.FC<SortOptionProps> = ({ value, label, isSelected, onOptionChange }) => {
  return (
    <label className={`sort-option-label ${isSelected ? 'sort-option-label-selected' : ''}`}>
      <input
        type="radio"
        className="sort-option-button"
        name="sortOptions"
        value={value}
        checked={isSelected}
        onChange={() => onOptionChange(value)}
      />
      <p>{label}</p>
    </label>
  );
};

export default SortOption;
