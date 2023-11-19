import { useRef, useEffect } from "react";

import Image from "next/image";

import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";

import PriceLevel from "@/components/ui/PriceLevel";
import StarRating from "@/components/ui/StarRating";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantInfo.module.scss";

interface RestaurantInfoProps {
  restaurant: RestaurantData;
  setSelectedRestaurant: (restaurant: RestaurantData | null) => void;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  setSelectedRestaurant,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedRestaurant(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedRestaurant]);

  return (
    <div className={styles.container}>
      <div className={styles.restaurantContainer} ref={containerRef}>
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
            sizes="100%"
            style={{ objectFit: "cover" }}
          />
          <CloseIcon
            className={styles.button}
            onClick={() => {
              setSelectedRestaurant(null);
            }}
          />
        </div>
        <div className={styles.topContainer}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          <div className={styles.subContainer}>
            <p className={styles.rating}>{restaurant.rating}</p>
            <StarRating rating={restaurant.rating} />
            <p className={styles.userRatingsTotal}>
              ({restaurant.userRatingsTotal})
            </p>
            {restaurant.priceLevel && <p>・</p>}
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
                  <a href={restaurant.website} target="_blank">
                    {restaurant.website}
                  </a>
                </p>
              </div>
            </div>
          )}
          {restaurant.url && (
            <div className={styles.iconContainer}>
              <GoogleIcon />
              <p className={styles.url}>
                <a href={restaurant.url} target="_blank">
                  Google Mapで表示
                </a>
              </p>
            </div>
          )}
          {restaurant.formattedPhoneNumber && (
            <div className={styles.iconContainer}>
              <PhoneIcon />
              <p className={styles.formattedPhoneNumber}>
                {restaurant.formattedPhoneNumber}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.nonScroll}></div>
    </div>
  );
};

export default RestaurantInfo;