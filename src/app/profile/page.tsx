"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import LoginSection from "@/components/base/Login/LoginSection";
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
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  const removeFavorite = (placeId: string) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (restaurant: RestaurantData) => restaurant.placeId !== placeId
      )
    );
  };

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

  useEffect(() => {
    if (user) {
      const fetchFollowCounts = async () => {
        try {
          const response = await client.get(`/follow_relationships/counts`, {
            params: { userSub: user.sub },
          });
          setFollowingCount(response.data.followingCount);
          setFollowersCount(response.data.followersCount);
        } catch (error) {
          console.error("フォロー関係の取得に失敗しました。", error);
        }
      };

      fetchFollowCounts();
    }
  }, [user]);

  if (isLoading || loadingFavorites) {
    return <LoadingSection />;
  }

  if (!user) {
    return <LoginSection />;
  }

  const userName = user?.name ?? "ゲスト";
  const userImage = user?.picture ?? guestImage;

  return (
    <div className={styles.container}>
      <UserInfo
        userName={userName}
        userImage={userImage}
        favoritesLength={favorites.length}
        followingCount={followingCount}
        followersCount={followersCount}
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

export default ProfilePage;
