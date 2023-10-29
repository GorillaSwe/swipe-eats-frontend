import Image from 'next/image';
import styles from './RestaurantListItem.module.scss';
import { RestaurantData } from "@/types/RestaurantData";
import StarRating from '@/components/ui/StarRating';
import PriceLevel from '@/components/ui/PriceLevel';

interface RestaurantListItemProps {
  restaurant: RestaurantData;
  setSelectedRestaurant: (restaurant: RestaurantData) => void;
  setHoveredRestaurant: (restaurant: RestaurantData | null) => void;
}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({ restaurant, setSelectedRestaurant, setHoveredRestaurant }) => {
  const quotaPhoto = "/images/restaurants/quota.png";

  return (
    <div className={styles.container}
      onClick={() => setSelectedRestaurant(restaurant)}
      onMouseOver={() => setHoveredRestaurant(restaurant)}
      onMouseOut={() => setHoveredRestaurant(null)}
    >
      <div className={styles.leftContainer} >
        <h3 className={styles.name}>{restaurant.name}</h3>
        <div className={styles.subContainer}>
          <p className={styles.rating}>{restaurant.rating}</p>
          <StarRating rating={restaurant.rating} />
          <p className={styles.userRatingsTotal}>({restaurant.userRatingsTotal})</p>
        </div>
        <PriceLevel priceLevel={restaurant.priceLevel} />
        <p className={styles.vicinity}>{restaurant.vicinity}</p>
      </div>
      <div className={styles.rightContainer} >
        <div className={styles.image}>
          <Image
            src={restaurant.photos && restaurant.photos[0] ? restaurant.photos[0] : quotaPhoto}
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </div>
      </div>
    </div>
  )
};

export default RestaurantListItem;