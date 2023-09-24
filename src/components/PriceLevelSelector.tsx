import React, { useState } from "react";

type PriceLevelSelectorProps = {
  selectedPriceLevels: number[];
  onPriceLevelChange: (selectedPriceLevels: number[]) => void;
};

const PriceLevelSelector: React.FC<PriceLevelSelectorProps> = ({
  selectedPriceLevels,
  onPriceLevelChange,
}) => {
  // 価格レベルのオプション
  const priceLevels = [
    { level: 0, label: "￥" },
    { level: 1, label: "￥￥" },
    { level: 2, label: "￥￥￥" },
    { level: 3, label: "￥￥￥￥" },
    { level: 4, label: "￥￥￥￥￥" },
  ];

  // 価格レベルが選択されたときのハンドラ
  const handleLevelClick = (level: number) => {
    // 選択状態をトグル
    if (selectedPriceLevels.includes(level)) {
      onPriceLevelChange(selectedPriceLevels.filter((l) => l !== level));
    } else {
      onPriceLevelChange([...selectedPriceLevels, level]);
    }
  };

  return (
    <div>
      <h3>価格帯</h3>
      <div className="price-level-selector">
        {priceLevels.map((priceLevel) => (
          <label
            key={priceLevel.level}
            className={`price-level-label ${selectedPriceLevels.includes(priceLevel.level) ? "price-level-label-selected" : ""}`}
          >
            <input
              type="checkbox"
              className="price-level-button"
              checked={selectedPriceLevels.includes(priceLevel.level)}
              onChange={() => handleLevelClick(priceLevel.level)}
            />
            <p>{priceLevel.label}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceLevelSelector;