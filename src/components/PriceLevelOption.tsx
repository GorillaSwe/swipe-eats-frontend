import React from "react";

type PriceLevelOptionProps = {
  level: number;
  label: string;
  isSelected: boolean;
  onLevelClick: (level: number) => void;
};

const PriceLevelOption: React.FC<PriceLevelOptionProps> = React.memo(({ 
  level,
  label,
  isSelected,
  onLevelClick
}: PriceLevelOptionProps) => {
  return (
    <label className={`price-level-label ${isSelected ? "price-level-label-selected" : ""}`}>
      <input
        type="checkbox"
        className="price-level-button"
        checked={isSelected}
        onChange={() => onLevelClick(level)}
      />
      <p>{label}</p>
    </label>
  );
});

export default PriceLevelOption;
