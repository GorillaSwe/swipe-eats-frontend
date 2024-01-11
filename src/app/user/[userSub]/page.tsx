"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0/client";
import InfiniteScroll from "react-infinite-scroller";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import PartialLoadingSection from "@/components/base/Loading/PartialLoadingSection";
import RestaurantInfo from "@/components/base/RestaurantInfo/RestaurantInfo";
import RestaurantListItemCard from "@/components/base/RestaurantListItemCard/RestaurantListItemCard";
import UserInfo from "@/components/base/UserInfo/UserInfo";
import Border from "@/components/ui/Border/Border";
import {
  getFavoritesCount,
  getOtherFavoritesInfo,
} from "@/lib/api/favoritesInfo";
import styles from "@/styles/UserProfilePage.module.scss";
import { RestaurantData } from "@/types/RestaurantData";

const UserProfilePage = ({ params }: { params: { userSub: string } }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const userSub = params.userSub;

  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isEmpty = dataLoaded && favorites.length === 0 && favoritesCount === 0;

  useEffect(() => {
    if (!isLoading) {
      if (user && user.sub === decodeURIComponent(userSub)) {
        router.push("/profile");
      }
    }
  }, [user, isLoading, userSub, router]);

  useEffect(() => {
    const fetchFavoritesCounts = async () => {
      if (userSub) {
        const [favoritesCounts] = await Promise.all([
          getFavoritesCount(userSub),
        ]);

        setFavoritesCount(favoritesCounts);
      }
    };
    fetchFavoritesCounts();
  }, [userSub]);

  const loadFavorites = async (page: number) => {
    try {
      const fetchedFavorites = await getOtherFavoritesInfo(userSub, page);
      setFavorites((prev) => [...prev, ...fetchedFavorites]);
      setHasMore(fetchedFavorites.length > 0);
    } catch (error) {
      console.error("お気に入りの取得に失敗しました。", error);
    } finally {
      setDataLoaded(true);
    }
  };

  const removeFavorite = (placeId: string) => {};
  const setRestaurants = () => {};

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <div className={styles.container}>
      <UserInfo
        isMyInfo={false}
        user={user}
        userSub={userSub}
        favoritesCount={favoritesCount}
      />

      <Border />

      <InfiniteScroll
        loadMore={loadFavorites}
        hasMore={hasMore}
        loader={<PartialLoadingSection key="loader" />}
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
              setRestaurants={setRestaurants}
              setSelectedRestaurant={() => setSelectedRestaurant(null)}
              removeFavorite={removeFavorite}
              displayFavorite={false}
            />
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserProfilePage;
