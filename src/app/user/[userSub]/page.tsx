"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0/client";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import RestaurantListItem from "@/features/profile/components/RestaurantListItem";
import UserInfo from "@/features/profile/components/UserInfo";
import RestaurantInfo from "@/features/user/components/RestaurantInfo";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const UserProfilePage = ({ params }: { params: { userSub: string } }) => {
  const { user, isLoading } = useUser();
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const guestImage = "/images/header/guest.png";
  const userSub = params.userSub;
  const router = useRouter();

  const removeFavorite = (placeId: string) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (restaurant: RestaurantData) => restaurant.placeId !== placeId
      )
    );
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await client.get(`/favorites/other_index`, {
          params: { userSub },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("お気に入りの取得に失敗しました。", error);
      }
      setLoadingFavorites(false);
    };

    if (!isLoading) {
      if (user && user.sub === decodeURIComponent(userSub)) {
        router.push("/profile");
      } else {
        fetchFavorites();
      }
    }
  }, [user, isLoading, userSub, router]);

  if (loadingFavorites) {
    return <LoadingSection />;
  }

  const userName = favorites[0].userName ?? "ゲスト";
  const userImage = favorites[0].userPicture ?? guestImage;

  return (
    <div className={styles.container}>
      <UserInfo
        userName={userName}
        userImage={userImage}
        favoritesLength={favorites.length}
      />

      <div className={styles.border}></div>

      <div className={styles.restaurantInfo}>
        <div className={styles.restaurantList}>
          {favorites.length > 0 ? (
            favorites.map((restaurant: RestaurantData) => (
              <RestaurantListItem
                restaurant={restaurant}
                setSelectedRestaurant={() => setSelectedRestaurant(restaurant)}
                key={restaurant.placeId}
              />
            ))
          ) : (
            <div className={styles.noRestaurants}>
              <h1>お気に入りがありません</h1>
            </div>
          )}
        </div>
        {selectedRestaurant && (
          <RestaurantInfo
            restaurant={selectedRestaurant}
            setSelectedRestaurant={() => setSelectedRestaurant(null)}
            removeFavorite={removeFavorite}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
