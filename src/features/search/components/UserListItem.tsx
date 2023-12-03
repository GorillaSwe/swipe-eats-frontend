import Image from "next/image";
import Link from "next/link";

import { UserData } from "@/types/UserData";

import styles from "./UserListItem.module.scss";

interface UserListItemProps {
  user: UserData;
}

const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
  const quotaPhoto = "/images/header/guest.png";

  return (
    <div className={styles.container}>
      <Link href={`/user/${user.sub}`}>
        <div className={styles.userContainer}>
          <div className={styles.image}>
            <Image
              src={user.picture ? user.picture : quotaPhoto}
              alt={user.name}
              priority={true}
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.nameContainer}>
            <p className={styles.name}>{user.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserListItem;
