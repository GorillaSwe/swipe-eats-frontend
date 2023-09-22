import React, { useEffect, useState } from "react"
import { showRestaurants } from "utils/api/restaurants"
import CardSwiper from "./components/CardSwiper"; // CardSwiperコンポーネントをインポート
import LocationSelector from "./components/LocationSelector"; // LocationSelectorコンポーネントをインポート
import './App.css'

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleShowRestaurants = async (latitude: number, longitude: number) => {
    try {
      const res = await showRestaurants(latitude, longitude);
      if (res && res.status === 200) {
        // レストランのデータを取得
        const restaurantData = res.message;
        setRestaurants(restaurantData);
      }
    } catch (error) {
      console.error("レストランデータの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      handleShowRestaurants(latitude, longitude);
    }
  }, [latitude, longitude]);

  return (
    <div>
      <LocationSelector onLocationChange={(lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
      }} />
      <CardSwiper cardData={restaurants} />
    </div>
  );
};

export default App;