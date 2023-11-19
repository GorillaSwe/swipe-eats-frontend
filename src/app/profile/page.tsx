"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

import LoadingScreen from "@/components/ui/LoadingScreen";
import LoginScreen from "@/components/ui/LoginScreen";
import RestaurantInfo from "@/features/profile/components/RestaurantInfo";
import RestaurantListItem from "@/features/profile/components/RestaurantListItem";
import UserInfo from "@/features/profile/components/UserInfo";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const ProfilePage: NextPage = () => {
  const { user, isLoading } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const guestImage = "/images/header/guest.png";

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const fetchFavorites = async () => {
          try {
            const tokenResponse = await fetch("/api/token");
            const tokenData = await tokenResponse.json();
            const token = tokenData.accessToken;

            const response = await client.get("/favorites", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setFavorites(response.data);
          } catch (error) {
            console.error("お気に入りの取得に失敗しました。", error);
          }
          setLoadingFavorites(false);
        };

        fetchFavorites();
      } else {
        setLoadingFavorites(false);
      }
    }
  }, [user, isLoading]);

  if (isLoading || loadingFavorites) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const userName = user?.name ?? "ゲスト";
  const userImage = user?.picture ?? guestImage;

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
            <p>お気に入りのレストランがありません。</p>
          )}
        </div>
        {selectedRestaurant && (
          <RestaurantInfo
            restaurant={selectedRestaurant}
            setSelectedRestaurant={() => setSelectedRestaurant(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
