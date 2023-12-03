import { useState, useEffect } from "react";

import Image from "next/image";

import { UserProfile } from "@auth0/nextjs-auth0/client";

import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  userName: string;
  userImage: string;
  favoritesLength: number;
  followingCount: number;
  followersCount: number;
  isFollowing: boolean;
  handleUnfollow: () => void;
  handleFollow: () => void;
  user: UserProfile | undefined;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userName,
  userImage,
  favoritesLength,
  followingCount,
  followersCount,
  isFollowing,
  handleUnfollow,
  handleFollow,
  user,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen((prev) => !prev);

  useEffect(() => {
    const closeDialog = (e: MouseEvent) => {
      if (isDialogOpen) setIsDialogOpen(false);
    };

    document.addEventListener("click", closeDialog);
    return () => document.removeEventListener("click", closeDialog);
  }, [isDialogOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <Image
          src={userImage}
          alt={`${userName}のプロフィール画像`}
          width={150}
          height={150}
          className={styles.image}
        />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.rightTopContainer}>
          <p className={styles.name}>{userName}</p>
          {user &&
            (isFollowing ? (
              <>
                <button className={styles.button} onClick={toggleDialog}>
                  フォロー中
                </button>
                <div
                  className={styles.deleteContainer}
                  style={{ display: isDialogOpen ? "flex" : "none" }}
                >
                  <div className={styles.deleteDialog}>
                    <div className={styles.deleteDialogTopContainer}>
                      <p className={styles.deleteTitle}>
                        フォローを解除しますか？
                      </p>
                    </div>
                    <div className={styles.deleteDialogBottomContainer}>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setIsDialogOpen(false)}
                      >
                        キャンセル
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={handleUnfollow}
                      >
                        フォロー解除
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button className={styles.button} onClick={handleFollow}>
                フォローする
              </button>
            ))}
        </div>
        <p className={styles.favoritesLength}>お気に入り{favoritesLength}件</p>
        <div className={styles.rightBottomContainer}>
          <p className={styles.followingLength}>
            <span>フォロー中</span>
            <span>{followingCount}人</span>
          </p>
          <p className={styles.followerLength}>
            <span>フォロワー</span>
            <span>{followersCount}人</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
