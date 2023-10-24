import { RestaurantData } from "@/types/RestaurantData";
import StarRating from '@/components/ui/StarRating';
import PriceLevel from '@/components/ui/PriceLevel';
import styles from './RestaurantInfo.module.scss';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import GoogleIcon from '@mui/icons-material/Google';
import Image from 'next/image';

interface RestaurantInfoProps {
  restaurant: RestaurantData;
  setSelectedRestaurant: (restaurant: RestaurantData | null) => void;
  setDirectionsResult: (directionsResult: google.maps.DirectionsResult | null) => void;
  setTravelTime: (travelTime: string | null) => void;
  setPreviousPlaceId: (previousPlaceId: string | null) => void;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant, setSelectedRestaurant, setDirectionsResult, setTravelTime, setPreviousPlaceId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        {restaurant.photos && restaurant.photos[0] ? (
          <Image
            src={restaurant.photos[0]}
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
          />
        ) : null}
        <button
          className={styles.button}
          onClick={() => {
            setSelectedRestaurant(null);
            setDirectionsResult(null);
            setTravelTime(null);
            setPreviousPlaceId(null);
          }}
        >
          ✖
        </button>
      </div>
      <div className={styles.topContainer}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <div className={styles.subContainer}>
          <p className={styles.rating}>{restaurant.rating}</p>
          <StarRating rating={restaurant.rating} />
          <p className={styles.userRatingsTotal}>({restaurant.userRatingsTotal})</p><p>・</p>
          <PriceLevel priceLevel={restaurant.priceLevel} />
        </div>
      </div>
      <div className={styles.border}></div>
      <div className={styles.bottomContainer}>
        <div className={styles.iconContainer}>
          <LocationOnIcon />
          <div className={styles.textContainer}>
            <p className={styles.postalCode}>〒{restaurant.postalCode}</p>
            <p className={styles.vicinity}>{restaurant.vicinity}</p>
          </div>
        </div>
        {restaurant.website && (
          <div className={styles.iconContainer}>
            <PublicIcon />
            <div className={styles.textContainer}>
              <p className={styles.website}>
                <a href={restaurant.website} target="_blank">{restaurant.website}</a>
              </p>
            </div>
          </div>
        )}
        {restaurant.url && (
          <div className={styles.iconContainer}>
            <GoogleIcon />
            <p className={styles.url}>
              <a href={restaurant.url} target="_blank">Google Mapで表示</a>
            </p>
          </div>
        )}
        {restaurant.formattedPhoneNumber && (
          <div className={styles.iconContainer}>
            <PhoneIcon />
            <p className={styles.formattedPhoneNumber}>{restaurant.formattedPhoneNumber}</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default RestaurantInfo;