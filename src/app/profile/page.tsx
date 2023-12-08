"use client";

import { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import LoginSection from "@/components/base/Login/LoginSection";
import RestaurantInfo from "@/components/base/RestaurantInfo/RestaurantInfo";
import RestaurantListItem from "@/components/base/RestaurantListItem/RestaurantListItem";
import UserInfo from "@/components/base/UserInfo/UserInfo";
import { getFavoritesCounts, getFavoritesInfo } from "@/lib/api/favoritesInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const ProfilePage: NextPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const token = useAccessToken();

  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchFavoritesCounts = async () => {
      if (user) {
        const [favoritesCounts] = await Promise.all([
          getFavoritesCounts(user.sub),
        ]);

        setFavoritesCount(favoritesCounts);
      }
    };
    fetchFavoritesCounts();
  }, [user]);

  const loadFavorites = async (page: number) => {
    try {
      const fetchedFavorites = await getFavoritesInfo(token, page);
      setFavorites((prev) => [...prev, ...fetchedFavorites]);
      setHasMore(fetchedFavorites.length > 0);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    } finally {
      setDataLoaded(true);
    }
  };

  const removeFavorite = (placeId: string) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (restaurant: RestaurantData) => restaurant.placeId !== placeId
      )
    );
    setFavoritesCount((prev) => prev - 1);
  };

  const setRestaurants = () => {};

  const isLoading = isUserLoading || (user && !token);
  const isEmpty = dataLoaded && favorites.length === 0;

  if (isLoading) {
    return <LoadingSection />;
  }

  if (!user) {
    return <LoginSection />;
  }

  return (
    <div className={styles.container}>
      <UserInfo
        isMyInfo={true}
        user={user}
        userSub={user.sub}
        favoritesCount={favoritesCount}
      />

      <div className={styles.border}></div>

      <InfiniteScroll
        loadMore={loadFavorites}
        hasMore={hasMore}
        loader={<LoadingSection />}
      >
        <div className={styles.restaurantInfo}>
          <div className={styles.restaurantList}>
            {isEmpty ? (
              <div className={styles.noRestaurants}>
                <h1>お気に入りがありません</h1>
              </div>
            ) : (
              favorites.map((restaurant: RestaurantData) => (
                <RestaurantListItem
                  restaurant={restaurant}
                  setSelectedRestaurant={() =>
                    setSelectedRestaurant(restaurant)
                  }
                  key={restaurant.placeId}
                />
              ))
            )}
          </div>
          {selectedRestaurant && (
            <RestaurantInfo
              restaurant={selectedRestaurant}
              setRestaurants={setRestaurants}
              setSelectedRestaurant={() => setSelectedRestaurant(null)}
              removeFavorite={removeFavorite}
              displayFavorite={true}
            />
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProfilePage;
