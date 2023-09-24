import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import PriceLevelSelector from "./PriceLevelSelector";
import SortOptions from "./SortOptions";

const SearchPage: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("restaurant");
  const [selectedRadius, setSelectedRadius] = useState<number>(100);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("recommend");
  const navigation = useNavigate();
  const location = useLocation();

  // URLからカテゴリ情報を取得して設定
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else {
      navigation("/");
    }
  }, [location, navigation]);

  // 位置情報の取得
  useEffect(() => {
    // 位置情報を取得する非同期関数を定義
    const getLocation = async () => {
      try {
        // 位置情報を取得
        const position = await getCurrentPosition();
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      } catch (error) {
        console.error("位置情報の取得に失敗しました:", error);
      }
    };
    // ページアクセス時に位置情報を取得
    getLocation();
  }, []);

  const handleSearch = () => {
    if (latitude !== null && longitude !== null) {
      // 検索条件をURLに追加して検索結果ページに遷移
      navigation(
        `/results?category=${selectedCategory}&radius=${selectedRadius}&latitude=${latitude}&longitude=${longitude}&priceLevels=${selectedPriceLevels.join(",")}&sort=${selectedSort}`
      );
    } else {
      console.log("位置情報がありません。");
    }
  };

  const valMap = [100, 500, 1000, 2000, 3000, 4000, 5000];

  const handleSliderChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = event.target as HTMLDivElement;
    const totalWidth = slider.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const percentage = (offsetX / totalWidth) * 100;
    const index = Math.round((percentage * (valMap.length - 1)) / 100);
    const newValue = valMap[index];
    setSelectedRadius(newValue);
  };
  
  // 半径の値に対応する表示用の文字列を取得する関数
  const getRadiusLabel = (radius: number): string => {
    if (radius >= 1000) {
      // 1000以上の場合、"km"で割った値を表示
      return `${radius / 1000}km`;
    } else {
      // それ以外の場合、"m"を表示
      return `${radius}m`;
    }
  };

  // 位置情報を取得する非同期関数
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };

  // 価格レベルが選択または解除されたときに呼び出されるハンドラ
  const handleLevelChange = (newSelectedLevels: number[]) => {
    setSelectedPriceLevels(newSelectedLevels);
  };

  const handleSortChange = (selectedSort: string) => {
    setSelectedSort(selectedSort);
  };

  return (
    <div>
      <h1>検索条件を設定してください</h1>
      <SortOptions selectedSort={selectedSort} onSortChange={handleSortChange} />
      {/* 距離の選択バー */}
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

      {/* PriceLevelSelector コンポーネントを使用 */}
      <PriceLevelSelector
        selectedPriceLevels={selectedPriceLevels} // 選択された価格レベルを渡す
        onPriceLevelChange={handleLevelChange} // レベルが変更されたときのハンドラを渡す
      />
      <div className="buttons">
        <button className="searchButton" onClick={handleSearch} >検索</button>
      </div>
    </div>
  );
};

export default SearchPage;
