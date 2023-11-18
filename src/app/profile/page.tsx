"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

import LoadingScreen from "@/components/ui/LoadingScreen";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const ProfilePage: NextPage = () => {
  const { user, isLoading } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const guestImage = "/images/header/guest.png";
  const quotaPhoto = "/images/restaurants/quota.png";

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
    return (
      <div>
        <h1>ログインが必要です</h1>
        <Link href="/api/auth/login">ログインする</Link>
      </div>
    );
  }

  const userImage = user?.picture ?? guestImage;
  const userName = user?.name ?? "ゲスト";

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.userLeftContainer}>
          <Image
            src={userImage}
            alt={`${userName}のプロフィール画像`}
            width={150}
            height={150}
            className={styles.image}
          />
        </div>
        <div className={styles.userRightContainer}>
          <p className={styles.name}>{user.name}</p>
          <p className={styles.favoritesLength}>
            お気に入り{favorites.length}件
          </p>
          <div className={styles.userRightBottomContainer}>
            <p className={styles.followingLength}>
              <span>フォロー中</span>
              <span>0人</span>
            </p>
            <p className={styles.followerLength}>
              <span>フォロワー</span>
              <span>0人</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.border}></div>

      <div className={styles.restaurantList}>
        {favorites.length > 0 ? (
          favorites.map((restaurant: RestaurantData) => (
            <div className={styles.restaurantListItem} key={restaurant.placeId}>
              <div className={styles.image}>
                <Image
                  src={
                    restaurant.photos && restaurant.photos[0]
                      ? restaurant.photos[0]
                      : quotaPhoto
                  }
                  alt={restaurant.name}
                  fill
                />
              </div>
              <div className={styles.name}>
                <p>{restaurant.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p>お気に入りのレストランがありません。</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
