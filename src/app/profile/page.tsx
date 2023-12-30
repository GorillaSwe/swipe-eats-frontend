"use client";

import { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import PartialLoadingSection from "@/components/base/Loading/PartialLoadingSection";
import LoginSection from "@/components/base/Login/LoginSection";
import RestaurantInfo from "@/components/base/RestaurantInfo/RestaurantInfo";
import RestaurantListItemCard from "@/components/base/RestaurantListItemCard/RestaurantListItemCard";
import UserInfo from "@/components/base/UserInfo/UserInfo";
import Border from "@/components/ui/Border/Border";
import { getFavoritesCount, getFavoritesInfo } from "@/lib/api/favoritesInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import styles from "@/styles/UserProfilePage.module.scss";
import { RestaurantData } from "@/types/RestaurantData";

const ProfilePage: NextPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const token = useAccessToken();

  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isLoading = isUserLoading || (user && !token);
  const isEmpty = dataLoaded && favorites.length === 0 && favoritesCount === 0;

  useEffect(() => {
    const fetchFavoritesCounts = async () => {
      if (user) {
        const [favoritesCounts] = await Promise.all([
          getFavoritesCount(user.sub),
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

      <Border />

      <InfiniteScroll
        loadMore={loadFavorites}
        hasMore={hasMore}
        loader={<PartialLoadingSection />}
      >
        <div className={styles.restaurantInfo}>
          <div className={styles.restaurantList}>
            {isEmpty ? (
              <div className={styles.noRestaurants}>
                <h1>お気に入りがありません</h1>
              </div>
            ) : (
              favorites.map((restaurant: RestaurantData) => (
                <RestaurantListItemCard
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
              setRestaurants={setFavorites}
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
