"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0/client";
import { AxiosError } from "axios";
import { NextPage } from "next";

import ErrorSection from "@/components/base/Error/ErrorSection";
import LoadingSection from "@/components/base/Loading/LoadingSection";
import { useSetRestaurantData } from "@/contexts/RestaurantContext";
import CardSwiper from "@/features/swipe/result/components/CardSwiper";
import { addFavorite } from "@/lib/api/favoritesInfo";
import { getRestaurants } from "@/lib/api/restaurantsInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const ResultPage: NextPage = () => {
  const token = useAccessToken();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setRestaurantData = useSetRestaurantData();
  const { user } = useUser();

  const latitude = parseFloat(searchParams.get("latitude") || "");
  const longitude = parseFloat(searchParams.get("longitude") || "");
  const category = searchParams.get("category") || "";
  const radius = parseInt(searchParams.get("radius") || "100");

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
        const price = searchParams.get("price") || "";
        const splittedPrice = price ? price.split(",").map(Number) : [];
        const sort = searchParams.get("sort") || "prominence";

        if (!latitude || !longitude) {
          throw new Error("位置情報がありません");
        }

        const res = await getRestaurants(
          latitude,
          longitude,
          category,
          radius,
          splittedPrice,
          sort
        );

        setRestaurants(res.message);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(
          axiosError.response?.data.error || "不明なエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, latitude, longitude, category, radius]);

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
        const likedRestaurants = restaurants.filter(
          (r) => r.isFavorite === true
        );
        await Promise.all(
          likedRestaurants.map((restaurant) => {
            addFavorite(token, restaurant.placeId, null, null);
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
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} category={category} />;
  }

  if (restaurants.length === 0) {
    return (
      <ErrorSection error="レストランが見つかりません。" category={category} />
    );
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
