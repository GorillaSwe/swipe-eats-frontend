import Image from "next/image";

import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantListItem.module.scss";

interface RestaurantListItemProps {
  restaurant: RestaurantData;
  setSelectedRestaurant: (restaurant: RestaurantData) => void;
}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({
  restaurant,
  setSelectedRestaurant,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";

  return (
    <div
      className={styles.container}
      onClick={() => setSelectedRestaurant(restaurant)}
    >
      <div className={styles.image}>
        <Image
          src={
            restaurant.photos && restaurant.photos[0]
              ? restaurant.photos[0]
              : quotaPhoto
          }
          alt={restaurant.name}
          sizes="300px"
          fill
        />
      </div>
      <div className={styles.name}>
        <p>{restaurant.name}</p>
      </div>
    </div>
  );
};

export default RestaurantListItem;
