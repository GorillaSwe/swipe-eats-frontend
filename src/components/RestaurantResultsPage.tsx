import React, { useEffect, useState } from "react";
import CardSwiper from "./CardSwiper";
import { useLocation, useNavigate } from "react-router-dom";
import { showRestaurants } from "../utils/api/restaurantApi";
import { getQueryParam } from "../utils/helpers"

const ResultsPage: React.FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const latitude = parseFloat(getQueryParam(queryParams, "latitude", ""));
  const longitude = parseFloat(getQueryParam(queryParams, "longitude", ""));
  const selectedCategory = getQueryParam(queryParams, "category", "restaurant");
  const selectedRadius = parseInt(getQueryParam(queryParams, "radius", "100"));
  const priceLevelsParam = getQueryParam(queryParams, "priceLevels", "");
  const selectedPriceLevels = priceLevelsParam.split(",").map(Number);
  const sortParam = getQueryParam(queryParams, "sort", "recommend");

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantsWithDirection, setRestaurantsWithDirection] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const navigation = useNavigate();
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await showRestaurants(latitude, longitude, selectedCategory, selectedRadius, selectedPriceLevels, sortParam);
        if (res && res.status === 200) {
          const restaurantData = res.message;
          setRestaurants(restaurantData);
          setRestaurantsWithDirection(restaurantData.map((restaurant: any) => ({
            ...restaurant,
            direction: "",
          }))); 
        }
      } catch (error) {
        setError("レストランデータの取得に失敗しました。");
      };
    };

    if (latitude && longitude) {
      fetchRestaurants();
    } else {
      setError("位置情報がありません。");
    }
  }, [latitude, longitude, selectedCategory, selectedRadius, selectedPriceLevels, sortParam]);

  const handleCardSwipe = (index :number, direction :string) => {
    setRestaurantsWithDirection(prev => {
      const updatedRestaurants = [...prev];
      updatedRestaurants[index].direction = direction;
      return updatedRestaurants;
    });
  }

  const handleLastCardSwipe = () => {
    navigation(`/map`, { state: { restaurantsWithDirection, latitude, longitude } });
  }

  return (
    <div>
      <h1>検索結果</h1>
      {error && <div className="error-message">{error}</div>}
      <CardSwiper cardData={restaurants} onCardSwipe={handleCardSwipe} onLastCardSwipe={handleLastCardSwipe} />
    </div>
  );
};

export default ResultsPage;
