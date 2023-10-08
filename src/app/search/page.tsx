"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PriceLevelSelector from "@/features/search/components/PriceLevelSelector";
import SortOptionSelector from "@/features/search/components/SortOptionSelector";
import DistanceSlider from "@/features/search/components/DistanceSlider";
import useLocation from "@/features/search/hooks/useLocation";
import styles from './page.module.css';

const DEFAULT_CATEGORY = "restaurant";
const DEFAULT_RADIUS = 100;
const DEFAULT_SORT = "recommend";

const SearchPage: React.FC = () => {
  const { latitude, longitude } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY);
  const [selectedRadius, setSelectedRadius] = useState<number>(DEFAULT_RADIUS);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(DEFAULT_SORT);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else {
      router.push("/");
    }
  }, []);

  const handleSearch = () => {
    if (latitude && longitude) {
      router.push(
        `/results?category=${selectedCategory}&radius=${selectedRadius}&latitude=${latitude}&longitude=${longitude}&priceLevels=${selectedPriceLevels.join(",")}&sort=${selectedSort}`
      );
    } else {
      console.log("位置情報がありません。");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索条件を設定してください</h1>
      <SortOptionSelector selectedSort={selectedSort} onSelectedSortChange={setSelectedSort} />
      <DistanceSlider selectedRadius={selectedRadius} onRadiusChange={setSelectedRadius} />
      <PriceLevelSelector
        selectedPriceLevels={selectedPriceLevels}
        onSelectedPriceLevelsChange={setSelectedPriceLevels}
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleSearch}>検索</button>
      </div>
    </div>
  );
};

export default SearchPage;
