"use client";

import { useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import PartialLoadingSection from "@/components/base/Loading/PartialLoadingSection";
import FavoriteInfo from "@/features/home/components/FavoriteInfo";
import { getHomeFavoritesInfo } from "@/lib/api/favoritesInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const HomePage: NextPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const token = useAccessToken();

  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isLoading = isUserLoading || (user && !token);
  const isEmpty = dataLoaded && favorites.length === 0;

  const loadFavorites = async (page: number) => {
    try {
      const fetchedFavorites = await getHomeFavoritesInfo(user, token, page);
      setFavorites((prev) => [...prev, ...fetchedFavorites]);
      setHasMore(fetchedFavorites.length > 0);
    } catch (error) {
      console.error("Error fetching favorites data: ", error);
    } finally {
      setDataLoaded(true);
    }
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <div className={styles.container}>
      <InfiniteScroll
        loadMore={loadFavorites}
        hasMore={hasMore}
        loader={<PartialLoadingSection />}
      >
        {isEmpty ? (
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
