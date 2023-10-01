import React from "react";
import { SORT_OPTIONS } from '../constants/sortOptions';
import SortOption from "./SortOption";

type SortOptionsProps = {
  selectedSort: string;
  onSelectedSortChange: (selectedSort: string) => void;
};

const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onSelectedSortChange }) => {
  return (
    <div>
      <h3>並び替え</h3>
      <div className="sort-options">
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
