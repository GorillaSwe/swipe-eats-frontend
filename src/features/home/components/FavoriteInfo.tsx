import React from "react";

import Image from "next/image";

import { RestaurantData } from "@/types/RestaurantData";

import styles from "./FavoriteInfo.module.scss";

type FavoriteInfoProps = {
  favorites: RestaurantData[];
};

const FavoriteInfo: React.FC<FavoriteInfoProps> = ({ favorites }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  return (
    <div>
      {favorites.map((favorite, index) => (
        <div key={index} className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.topLeftContainer}>
              <div className={styles.userPicture}>
                <Image
                  src={favorite.userPicture}
                  alt={favorite.userName}
                  width={30}
                  height={30}
                />
              </div>
              <p>{favorite.userName}</p>
            </div>
            <div className={styles.topRightContainer}>
              <p>{formatDate(favorite.createdAt)}</p>
            </div>
          </div>
          <div className={styles.middleContainer}>
            <p>「{favorite.name}」をお気に入りに追加しました</p>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.photo}>
              {favorite.photos && (
                <Image
                  src={favorite.photos[0]}
                  alt={favorite.name}
                  width={500}
                  height={300}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteInfo;
