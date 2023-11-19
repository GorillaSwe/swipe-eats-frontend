import Image from "next/image";

import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  userName: string;
  userImage: string;
  favoritesLength: number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userName,
  userImage,
  favoritesLength,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";

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
        <p className={styles.name}>{userName}</p>
        <p className={styles.favoritesLength}>お気に入り{favoritesLength}件</p>
        <div className={styles.rightBottomContainer}>
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
  );
};

export default UserInfo;
