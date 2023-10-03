"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PriceLevelSelector from "../../components/PriceLevelSelector";
import SortOptions from "../../components/SortOptions";

const DEFAULT_CATEGORY = "restaurant";
const DEFAULT_RADIUS = 100;
const DEFAULT_SORT = "recommend";
const valMap = [100, 500, 1000, 2000, 3000, 4000, 5000];

const SearchPage: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
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
    
    fetchCurrentPosition();
  }, []);

  const fetchCurrentPosition = async () => {
    try {
      const position = await getCurrentPosition();
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    } catch (error) {
      console.error("位置情報の取得に失敗しました:", error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const handleSliderChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = event.target as HTMLDivElement;
    const totalWidth = slider.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const percentage = (offsetX / totalWidth) * 100;
    const index = Math.round((percentage * (valMap.length - 1)) / 100);
    setSelectedRadius(valMap[index]);
  };

  const handleSearch = () => {
    if (latitude && longitude) {
      router.push(
        `/results?category=${selectedCategory}&radius=${selectedRadius}&latitude=${latitude}&longitude=${longitude}&priceLevels=${selectedPriceLevels.join(",")}&sort=${selectedSort}`
      );
    } else {
      console.log("位置情報がありません。");
    }
  };

  const getRadiusLabel = (radius: number): string => {
    return radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;
  };

  return (
    <div>
      <h1>検索条件を設定してください</h1>
      <SortOptions selectedSort={selectedSort} onSelectedSortChange={setSelectedSort} />
      <div className="distance-wrap">
        <h3>最長距離</h3>
        <div id="distance-slider" onClick={handleSliderChange}>
          {valMap.map((value, index) => (
            <label
              key={index}
              style={{ left: `${(index / (valMap.length - 1)) * 100}%` }}
            >
              {getRadiusLabel(value)}
            </label>
          ))}
          <div
            className="slider-handle"
            style={{ left: `${(valMap.indexOf(selectedRadius) / (valMap.length - 1)) * 100}%` }}
          >
          </div>
        </div>
      </div>

      <PriceLevelSelector
        selectedPriceLevels={selectedPriceLevels}
        onSelectedPriceLevelsChange={setSelectedPriceLevels}
      />
      <div className="buttons">
        <button className="searchButton" onClick={handleSearch} >検索</button>
      </div>
    </div>
  );
};

export default SearchPage;
