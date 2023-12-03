"use client";

import { useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import FavoriteInfo from "@/features/home/components/FavoriteInfo";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const HomePage: NextPage = () => {
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const { user, isLoading } = useUser();

  const [hasMore, setHasMore] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadUsersFavorites = async (page: number) => {
    const response = await client.get("/favorites/latest", {
      params: { page },
    });
    setFavorites((prev) => [...prev, ...response.data.favorites]);
    setHasMore(response.data.favorites.length > 0);
    setDataLoaded(true);
  };

  const loadFollowedUsersFavorites = async (page: number) => {
    if (user) {
      try {
        const tokenResponse = await fetch("/api/token");
        const tokenData = await tokenResponse.json();
        const token = tokenData.accessToken;

        const response = await client.get("/favorites/followed", {
          params: { page },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites((prev) => [...prev, ...response.data.favorites]);
        setHasMore(response.data.favorites.length > 0);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setDataLoaded(true);
      }
    }
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <div className={styles.container}>
      <InfiniteScroll
        loadMore={user ? loadFollowedUsersFavorites : loadUsersFavorites}
        hasMore={hasMore}
        loader={<LoadingSection />}
      >
        {dataLoaded && favorites.length === 0 ? (
          <h1 className={styles.message}>
            <span>フォローしているユーザーの</span>
            <span>お気に入りレストランがありません</span>
          </h1>
        ) : (
          <FavoriteInfo favorites={favorites} />
        )}
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
