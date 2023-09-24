import React from "react";

type SortOptionsProps = {
  selectedSort: string;
  onSortChange: (selectedSort: string) => void;
};

const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onSortChange }) => {
  const sortOptions = [
    { value: "recommend", label: "おすすめ" },
    { value: "distance", label: "距離順" },
    { value: "highRating", label: "高評価順" },
    { value: "highPrice", label: "高い順" },
    { value: "lowPrice", label: "安い順" },
  ];

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    onSortChange(selectedValue);
  };

  return (
    <div>
      <h3>並び替え</h3>
      <div className="sort-options">
        {sortOptions.map((option) => (
          <label key={option.value} className={`sort-option-label ${selectedSort === option.value ? 'sort-option-label-selected' : ''}`}>
            <input
              type="radio"
              className="sort-option-button"
              name="sortOptions"
              value={option.value}
              checked={selectedSort === option.value}
              onChange={handleSortChange}
            />
            <p>{option.label}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SortOptions;
