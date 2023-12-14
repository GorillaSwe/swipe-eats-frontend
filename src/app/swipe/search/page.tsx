"use client";

import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { NextPage } from "next";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import DistanceSlider from "@/features/swipe/search/components/DistanceSlider";
import LocationSelector from "@/features/swipe/search/components/LocationSelector";
import PriceLevelSelector from "@/features/swipe/search/components/PriceLevelSelector";
import SortOptionSelector from "@/features/swipe/search/components/SortOptionSelector";
import useLocation from "@/lib/useLocation";

import styles from "./page.module.scss";

const DEFAULT_RADIUS = 100;
const DEFAULT_SORT = "prominence";

const SearchPage: NextPage = () => {
  const { latitude, longitude } = useLocation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSort, setSelectedSort] = useState<string>(DEFAULT_SORT);
  const [selectedRadius, setSelectedRadius] = useState<number>(DEFAULT_RADIUS);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude,
    longitude,
  });

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (latitude && longitude) {
      setSelectedLocation({ latitude, longitude });
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  const updateLocation = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const handleSearch = () => {
    if (selectedLocation.latitude && selectedLocation.longitude) {
      router.push(
        `/swipe/result?category=${selectedCategory}&radius=${selectedRadius}&latitude=${
          selectedLocation.latitude
        }&longitude=${
          selectedLocation.longitude
        }&price=${selectedPriceLevels.join(",")}&sort=${selectedSort}`
      );
    } else {
      console.log("位置情報がありません。");
    }
  };

  if (isLoading) {
    return <LoadingSection />;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索条件を設定してください</h1>
      <LocationSelector onLocationUpdate={updateLocation} />
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
