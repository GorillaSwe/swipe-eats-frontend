"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0/client";
import { AxiosError } from "axios";
import { NextPage } from "next";

import ErrorScreen from "@/components/base/Error/ErrorScreen";
import LoadingScreen from "@/components/base/Loading/LoadingScreen";
import { useSetRestaurantData } from "@/contexts/RestaurantContext";
import { getRestaurantsInfo } from "@/features/swipe/result/api/getRestaurantsInfo";
import CardSwiper from "@/features/swipe/result/components/CardSwiper";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const ResultPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const latitude = parseFloat(searchParams.get("latitude") || "");
  const longitude = parseFloat(searchParams.get("longitude") || "");
  const category = searchParams.get("category") || "";
  const radius = parseInt(searchParams.get("radius") || "100");
  const price = searchParams.get("price") || "";
  const splittedPrice = price ? price.split(",").map(Number) : [];
  const sort = searchParams.get("sort") || "prominence";
  const setRestaurantData = useSetRestaurantData();
  const { user } = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  interface ErrorResponse {
    error: string;
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await getRestaurantsInfo(
          latitude,
          longitude,
          category,
          radius,
          splittedPrice,
          sort
        );
        const updatedRestaurants = res.message.map(
          (restaurant: RestaurantData) => ({
            ...restaurant,
            isFavorite: null,
          })
        );
        setRestaurants(updatedRestaurants);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.error
        ) {
          setError(axiosError.response.data.error);
        } else {
          setError("不明なエラーが発生しました");
        }
      }
      setIsLoading(false);
    };

    if (latitude && longitude) {
      fetchRestaurants();
    } else {
      setError("位置情報がありません");
    }
  }, []);

  const handleCardSwipe = (index: number, direction: string) => {
    index > 0 && setCurrentIndex(restaurants.length - index);
    setRestaurants((prev) => {
      const updatedRestaurants = [...prev];
      updatedRestaurants[index].isFavorite =
        direction === "right" ? true : direction === "left" ? false : null;
      return updatedRestaurants;
    });
  };

  const sendRestaurantsData = async (restaurants: RestaurantData[]) => {
    if (user) {
      try {
        const tokenResponse = await fetch("/api/token");
        const tokenData = await tokenResponse.json();
        const token = tokenData.accessToken;

        const likedRestaurants = restaurants.filter(
          (r) => r.isFavorite === true
        );

        await Promise.all(
          likedRestaurants.map((restaurant) => {
            return client.post(
              "/favorites",
              { placeId: restaurant.placeId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          })
        );
      } catch (err) {
        console.error("バックエンドへのデータ送信エラー:", err);
      }
    }
  };

  const handleLastCardSwipe = async () => {
    setRestaurantData({
      restaurants: [...restaurants].reverse(),
      latitude,
      longitude,
      radius,
    });
    sendRestaurantsData(restaurants);
    router.push(`/swipe/map`);
  };

  const handleCardRestore = (index: number) => {
    setCurrentIndex(restaurants.length - index - 1);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (restaurants.length <= 0 || error) {
    return <ErrorScreen error={error} category={category} />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        検索結果：
        {restaurants.length > 0 && (
          <span className={styles.resultCount}>
            {restaurants.length}件中 {currentIndex + 1}件目
          </span>
        )}
      </h1>
      <CardSwiper
        restaurants={restaurants}
        onCardSwipe={handleCardSwipe}
        onLastCardSwipe={handleLastCardSwipe}
        onCardRestore={handleCardRestore}
      />
    </div>
  );
};

export default ResultPage;
