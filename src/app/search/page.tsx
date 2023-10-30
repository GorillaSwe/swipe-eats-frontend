"use client";

import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { NextPage } from "next";

import LoadingScreen from "@/components/ui/LoadingScreen";
import DistanceSlider from "@/features/search/components/DistanceSlider";
import PriceLevelSelector from "@/features/search/components/PriceLevelSelector";
import SortOptionSelector from "@/features/search/components/SortOptionSelector";
import useLocation from "@/features/search/hooks/useLocation";

import styles from "./page.module.scss";

const DEFAULT_RADIUS = 100;
const DEFAULT_SORT = "prominence";

const SearchPage: NextPage = () => {
  const { latitude, longitude } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedRadius, setSelectedRadius] = useState<number>(DEFAULT_RADIUS);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(DEFAULT_SORT);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (latitude && longitude) {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  const handleSearch = () => {
    if (latitude && longitude) {
      router.push(
        `/results?category=${selectedCategory}&radius=${selectedRadius}&latitude=${latitude}&longitude=${longitude}&price=${selectedPriceLevels.join(
          ","
        )}&sort=${selectedSort}`
      );
    } else {
      console.log("位置情報がありません。");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索条件を設定してください</h1>
      <SortOptionSelector
        selectedSort={selectedSort}
        onSelectedSortChange={setSelectedSort}
      />
      <DistanceSlider
        selectedRadius={selectedRadius}
        onRadiusChange={setSelectedRadius}
      />
      <PriceLevelSelector
        selectedPriceLevels={selectedPriceLevels}
        onSelectedPriceLevelsChange={setSelectedPriceLevels}
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleSearch}>
          検索
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
