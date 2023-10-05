"use client";

import React, { useEffect, useState, useContext } from "react";
import CardSwiper from "@/components/CardSwiper";
import { useSearchParams, useRouter } from "next/navigation";
import { showRestaurants } from "@/utils/api/restaurantApi";
import { useSetRestaurantData } from '@/contexts/RestaurantContext';
import { RestaurantData } from "@/types/RestaurantData";
import styles from './page.module.css';

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const selectedCategory = searchParams.get('category') || 'restaurant';
  const selectedRadius = parseInt(searchParams.get('radius') || '100');
  const priceLevelsParam = searchParams.get('priceLevels') || '';
  const selectedPriceLevels = priceLevelsParam.split(",").map(Number);
  const sortParam = searchParams.get('sort') || 'recommend';
  const setRestaurantData = useSetRestaurantData();

  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [restaurantsWithDirection, setRestaurantsWithDirection] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const handleCardSwipe = (index :number, direction :string) => {
    setRestaurantsWithDirection(prev => {
      const updatedRestaurants = [...prev];
      updatedRestaurants[index].direction = direction;
      return updatedRestaurants;
    });
  }

  const handleLastCardSwipe = () => {
    setRestaurantData({
      restaurantsWithDirection,
      latitude,
      longitude
    });
    router.push(`/map`);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索結果</h1>
      {error && <div className={styles.error}>{error}</div>}
      <CardSwiper restaurants={restaurants} onCardSwipe={handleCardSwipe} onLastCardSwipe={handleLastCardSwipe} />
    </div>
  );
};

export default ResultsPage;
