"use client";

import { useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingScreen from "@/components/base/Loading/LoadingScreen";
import FavoriteInfo from "@/features/home/components/FavoriteInfo";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const HomePage: NextPage = () => {
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const { user, isLoading } = useUser();

  const [hasMore, setHasMore] = useState(true);

  const loadMore = async (page: number) => {
    const response = await client.get("/favorites/latest", {
      params: { page },
    });
    setFavorites((prev) => [...prev, ...response.data.favorites]);
    setHasMore(response.data.favorites.length > 0);
  };

  return (
    <div className={styles.container}>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<LoadingScreen />}
      >
        <FavoriteInfo favorites={favorites} />
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
