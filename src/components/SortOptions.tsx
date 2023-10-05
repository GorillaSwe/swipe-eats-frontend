import React from "react";
import { SORT_OPTIONS } from '@/constants/sortOptions';
import SortOption from "./SortOption";
import styles from './SortOptions.module.css';

type SortOptionsProps = {
  selectedSort: string;
  onSelectedSortChange: (selectedSort: string) => void;
};

const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onSelectedSortChange }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>並び替え</h3>
      <div className={styles.option}>
        {SORT_OPTIONS.map((option) => (
          <SortOption
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedSort === option.value}
            onOptionChange={() => onSelectedSortChange(option.value)}
            />
        ))}
      </div>
    </div>
  );
};

export default SortOptions;
