import Image from "next/image";

import PriceLevel from "@/components/ui/PriceLevel";
import StarRating from "@/components/ui/StarRating";
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
      <div className={styles.leftContainer}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <div className={styles.subContainer}>
          <p className={styles.rating}>{restaurant.rating}</p>
          <StarRating rating={restaurant.rating} />
          <p className={styles.userRatingsTotal}>
            ({restaurant.userRatingsTotal})
          </p>
        </div>
        <PriceLevel priceLevel={restaurant.priceLevel} />
        <p className={styles.vicinity}>{restaurant.vicinity}</p>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.image}>
          <Image
            src={
              restaurant.photos && restaurant.photos[0]
                ? restaurant.photos[0]
                : quotaPhoto
            }
            alt={restaurant.name}
            priority={true}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantListItem;
