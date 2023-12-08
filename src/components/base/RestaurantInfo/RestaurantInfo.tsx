import { useRef, useEffect, useState } from "react";

import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ContactInfo from "@/components/base/RestaurantInfo/ContactInfo";
import DeleteDialog from "@/components/base/RestaurantInfo/DeleteDialog";
import PriceLevel from "@/components/ui/PriceLevel";
import StarRating from "@/components/ui/StarRating";
import { addFavorites, deleteFavorites } from "@/lib/api/favoritesInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantInfo.module.scss";

interface RestaurantInfoProps {
  restaurant: RestaurantData;
  setRestaurants: React.Dispatch<React.SetStateAction<RestaurantData[]>>;
  setSelectedRestaurant: (restaurant: RestaurantData | null) => void;
  removeFavorite: (restaurantId: string) => void;
  displayFavorite: boolean;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  setRestaurants,
  setSelectedRestaurant,
  removeFavorite,
  displayFavorite,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";
  const token = useAccessToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);
  const { user } = useUser();

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

  const handleDelete = async () => {
    try {
      deleteFavorites(token, restaurant.placeId);
      removeFavorite(restaurant.placeId);
      setIsFavorite(false);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === restaurant.placeId ? { ...r, isFavorite: false } : r
        )
      );
      setIsDialogOpen(false);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error("削除に失敗しました: ", error);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      addFavorites(token, restaurant.placeId);
      setIsFavorite(true);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === restaurant.placeId ? { ...r, isFavorite: true } : r
        )
      );
    } catch (error) {
      console.error("お気に入り追加に失敗しました: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <CloseIcon
        className={styles.button}
        onClick={() => {
          setSelectedRestaurant(null);
        }}
      />
      <div className={styles.restaurantContainer} ref={containerRef}>
        <div className={styles.image}>
          <Image
            src={restaurant.photos?.[0] ? restaurant.photos[0] : quotaPhoto}
            alt={restaurant.name}
            priority={true}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.details}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          <div className={styles.subDetails}>
            <div className={styles.ratingContainer}>
              <p className={styles.rating}>{restaurant.rating}</p>
              <StarRating rating={restaurant.rating} />
              <p className={styles.userRatingsTotal}>
                ({restaurant.userRatingsTotal})
              </p>
              {restaurant.priceLevel && <p>・</p>}
              <PriceLevel priceLevel={restaurant.priceLevel} />
            </div>
            {displayFavorite &&
              user &&
              (isFavorite ? (
                <FavoriteIcon
                  className={styles.favoriteIcon}
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  className={styles.nonFavoriteIcon}
                  onClick={handleAddToFavorites}
                />
              ))}
          </div>
        </div>
        {isDialogOpen && (
          <DeleteDialog
            handleDelete={handleDelete}
            setIsDialogOpen={() => setIsDialogOpen(false)}
          />
        )}
        <div className={styles.border}></div>
        <ContactInfo restaurant={restaurant} />
      </div>
      <div className={styles.nonScroll}></div>
    </div>
  );
};

export default RestaurantInfo;
