import { RestaurantData } from "@/types/RestaurantData";
import StarRating from '@/components/ui/StarRating';
import PriceLevel from '@/components/ui/PriceLevel';
import styles from './CardInfo.module.scss';

interface CardInfoProps {
  restaurant: RestaurantData;
}

const CardInfo: React.FC<CardInfoProps> = ({ restaurant }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.name}>{restaurant.name}</h3>
      <p className={styles.vicinity}>{restaurant.vicinity}</p>
      <div className={styles.subContainer}>
        <p className={styles.rating}>{restaurant.rating} </p>
        <StarRating rating={restaurant.rating} />
        <p className={styles.userRatingsTotal}>({restaurant.userRatingsTotal})</p><p>・</p>
        <PriceLevel priceLevel={restaurant.priceLevel} />
      </div>
    </div>
  );
};

export default CardInfo;