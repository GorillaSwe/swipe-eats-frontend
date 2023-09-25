import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { showRestaurants } from "../utils/api/restaurants";
import CardSwiper from "./CardSwiper";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const latitude = parseFloat(queryParams.get("latitude") || "") || null;
  const longitude = parseFloat(queryParams.get("longitude") || "") || null;
  const selectedCategory = queryParams.get("category") || "restaurant";
  const selectedRadius = parseInt(queryParams.get("radius") || "5", 10);
  const priceLevelsParam = queryParams.get("priceLevels");
  const selectedPriceLevels = priceLevelsParam ? priceLevelsParam.split(",").map(Number) : [];
  const sortParam = queryParams.get("sort") || "recommend";
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      console.log("位置情報がありません。");
      return;
    }
    // URLから取得した条件でレストランを検索
    const fetchRestaurants = async () => {
      try {
        const res = await showRestaurants(latitude, longitude, selectedCategory, selectedRadius, selectedPriceLevels, sortParam);
        if (res && res.status === 200) {
          const restaurantData = res.message;
          setRestaurants(restaurantData);
        }
      } catch (error) {
        console.error("レストランデータの取得に失敗しました:", error);
      };
    }
    fetchRestaurants();
  }, [location]);

  return (
    <div>
      <h1>検索結果</h1>
      <CardSwiper cardData={restaurants} />
    </div>
  );
};

export default ResultsPage;
