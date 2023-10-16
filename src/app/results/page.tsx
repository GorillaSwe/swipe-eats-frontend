"use client";

import { useEffect, useState } from "react";
import CardSwiper from "@/features/results/components/CardSwiper";
import { useSearchParams, useRouter } from "next/navigation";
import { getRestaurantsInfo } from "@/features/results/api/getRestaurantsInfo";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSetRestaurantData } from '@/contexts/RestaurantContext';
import { RestaurantData } from "@/types/RestaurantData";
import styles from './page.module.css';
import { AxiosError } from "axios";

const ResultPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const category = searchParams.get('category') || '';
  const radius = parseInt(searchParams.get('radius') || '100');
  const price = searchParams.get('price') || '';
  const splittedPrice = price ? price.split(",").map(Number) : [];
  const sort = searchParams.get('sort') || 'prominence';
  const setRestaurantData = useSetRestaurantData();

  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [restaurantsWithDirection, setRestaurantsWithDirection] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  interface ErrorResponse {
    error: string;
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await getRestaurantsInfo(latitude, longitude, category, radius, splittedPrice, sort);
        setRestaurants(res.message);
        setRestaurantsWithDirection(res.message.map((restaurant: any) => ({
          ...restaurant,
          direction: "",
        })));
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
          setError(axiosError.response.data.error);
        } else {
          setError("不明なエラーが発生しました。");
        }
      }
      setIsLoading(false);
    };

    if (latitude && longitude) {
      fetchRestaurants();
    } else {
      setError("位置情報がありません。");
    }
  }, []);

  const handleCardSwipe = (index: number, direction: string) => {
    setRestaurantsWithDirection(prev => {
      const updatedRestaurants = [...prev];
      updatedRestaurants[index].direction = direction;
      return updatedRestaurants;
    });
  }

  const handleLastCardSwipe = () => {
    const reversedRestaurantsWithDirection = [...restaurantsWithDirection].reverse();
    setRestaurantData({
      restaurantsWithDirection: reversedRestaurantsWithDirection,
      latitude,
      longitude,
      radius
    });
    router.push(`/map`);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索結果</h1>
      {error ? (
        <>
          <div className={styles.error}><p>{error}</p></div>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => router.push(`/search/?category=${category}`)}>検索条件を変更</button>
          </div>
        </>
      ) : (
        <CardSwiper restaurants={restaurants} onCardSwipe={handleCardSwipe} onLastCardSwipe={handleLastCardSwipe} />
      )}
    </div>
  );
};

export default ResultPage;
