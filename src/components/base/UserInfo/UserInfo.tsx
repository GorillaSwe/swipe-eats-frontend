import { useEffect, useState } from "react";

import Image from "next/image";

import { UserProfile } from "@auth0/nextjs-auth0/client";

import {
  followRelationship,
  getFollowRelationship,
  getFollowRelationshipsCount,
  unfollowRelationship,
} from "@/lib/api/followRelationshipsInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { getUserProfile } from "@/lib/api/usersInfo";

import styles from "./UserInfo.module.scss";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

interface UserInfoProps {
  isMyInfo: boolean;
  user: UserProfile | undefined;
  userSub: string | null | undefined;
  favoritesCount: number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  isMyInfo,
  user,
  userSub,
  favoritesCount,
}) => {
  const token = useAccessToken();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: "ゲスト",
    picture: "/images/header/guest.png",
  });

  // フォローしているかを取得
  useEffect(() => {
    if (!isMyInfo && user && token) {
      const checkFollowStatus = async () => {
        try {
          const [isFollowingRelationship] = await Promise.all([
            getFollowRelationship(userSub, token),
          ]);
          setIsFollowing(isFollowingRelationship);
        } catch (error) {
          console.error("お気に入りの取得に失敗しました。", error);
        }
      };
      checkFollowStatus();
    }
  }, [isMyInfo, user, userSub, token]);

  const fetchFollowCounts = async () => {
    try {
      const [followCounts] = await Promise.all([
        getFollowRelationshipsCount(userSub),
      ]);
      setFollowingCount(followCounts.followingCount);
      setFollowersCount(followCounts.followersCount);
    } catch (error) {
      console.error("Error fetching follow counts: ", error);
    }
  };

  useEffect(() => {
    if (userSub) {
      fetchFollowCounts();
    }
  }, [userSub, isFollowing]);

  // ユーザーのプロフィールを取得
  useEffect(() => {
    if (userSub) {
      const fetchUserProfile = async () => {
        try {
          const [userProfile] = await Promise.all([getUserProfile(userSub)]);
          setUserProfile(userProfile);
        } catch (error) {
          console.error("ユーザープロフィールの取得に失敗しました。", error);
        }
      };
      fetchUserProfile();
    }
  }, [userSub]);

  const handleFollow = async () => {
    try {
      await followRelationship(userSub, token);
      setIsFollowing(true);
      await fetchFollowCounts();
    } catch (error) {
      console.error("Unable to follow", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowRelationship(userSub, token);
      setIsFollowing(false);
      setIsDialogOpen(false);
      await fetchFollowCounts();
    } catch (error) {
      console.error("Unable to unfollow", error);
    }
  };

  return (
    <div className={styles.container}>
      <Image
        src={userProfile.picture}
        alt={`${userProfile.name}のプロフィール画像`}
        width={150}
        height={150}
        className={styles.image}
      />
      <div className={styles.infoContainer}>
        <div className={styles.infoTopContainer}>
          <p className={styles.name}>{userProfile.name}</p>
          {!isMyInfo &&
            user &&
            (isFollowing ? (
              <>
                <button
                  className={styles.button}
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                >
                  フォロー中
                </button>
                {isDialogOpen && (
                  <ConfirmationDialog
                    setIsDialogOpen={() => setIsDialogOpen(false)}
                    handleAction={handleUnfollow}
                    title="フォローを解除しますか？"
                    confirmButtonText="フォロー解除"
                  />
                )}
              </>
            ) : (
              <button className={styles.button} onClick={handleFollow}>
                フォローする
              </button>
            ))}
        </div>
        <p className={styles.favoritesCount}>お気に入り{favoritesCount}件</p>
        <div className={styles.countsContainer}>
          <p className={styles.followingCount}>
            <span>フォロー中</span>
            <span>{followingCount}人</span>
          </p>
          <p className={styles.followersCount}>
            <span>フォロワー</span>
            <span>{followersCount}人</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
