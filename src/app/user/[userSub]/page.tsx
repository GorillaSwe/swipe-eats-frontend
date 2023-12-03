"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useUser } from "@auth0/nextjs-auth0/client";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import RestaurantListItem from "@/features/profile/components/RestaurantListItem";
import RestaurantInfo from "@/features/user/components/RestaurantInfo";
import UserInfo from "@/features/user/components/UserInfo";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const UserProfilePage = ({ params }: { params: { userSub: string } }) => {
  const { user, isLoading } = useUser();
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const userSub = params.userSub;
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const defaultUserName = "ゲスト";
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

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const checkFollowStatus = async () => {
          try {
            const tokenResponse = await fetch("/api/token");
            const tokenData = await tokenResponse.json();
            const token = tokenData.accessToken;

            const response = await client.get(`/follow_relationships`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: { userSub: userSub },
            });
            setIsFollowing(response.data.isFollowing);
          } catch (error) {
            console.error("お気に入りの取得に失敗しました。", error);
          }
        };
        checkFollowStatus();
      }
    }
  }, [user, isLoading, userSub]);

  const handleFollow = async () => {
    if (!isLoading) {
      if (user) {
        try {
          const tokenResponse = await fetch("/api/token");
          const tokenData = await tokenResponse.json();
          const token = tokenData.accessToken;

          await client.post(
            `/follow_relationships`,
            { userSub: userSub },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(true);
        } catch (error) {
          console.error("Unable to follow", error);
        }
      }
    }
  };

  const handleUnfollow = async () => {
    if (!isLoading) {
      if (user) {
        try {
          const tokenResponse = await fetch("/api/token");
          const tokenData = await tokenResponse.json();
          const token = tokenData.accessToken;

          await client.delete(
            `/follow_relationships/destroy_by_user_sub/${userSub}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(false);
        } catch (error) {
          console.error("Unable to unfollow", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const response = await client.get(`/follow_relationships/counts`, {
          params: { userSub: userSub },
        });
        setFollowingCount(response.data.followingCount);
        setFollowersCount(response.data.followersCount);
      } catch (error) {
        console.error("フォロー関係の取得に失敗しました。", error);
      }
    };

    fetchFollowCounts();
  }, [userSub, isFollowing]);

  if (loadingFavorites && !isLoading) {
    return <LoadingSection />;
  }

  const userName =
    favorites.length > 0 ? favorites[0].userName : defaultUserName;
  const userImage =
    favorites.length > 0 ? favorites[0].userPicture : guestImage;

  return (
    <div className={styles.container}>
      <UserInfo
        userName={userName}
        userImage={userImage}
        favoritesLength={favorites.length}
        followingCount={followingCount}
        followersCount={followersCount}
        isFollowing={isFollowing}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        user={user}
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
