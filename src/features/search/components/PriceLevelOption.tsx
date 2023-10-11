import React from "react";
import styles from './PriceLevelOption.module.css';

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
    <label className={`${styles.label} ${isSelected ? styles.selected : ''}`}>
      <input
        type="checkbox"
        className={styles.button}
        checked={isSelected}
        onChange={() => onLevelClick(level)}
      />
      <p className={styles.text}>{label}</p>
    </label>
  );
});

PriceLevelOption.displayName = "PriceLevelOption";


export default PriceLevelOption;
