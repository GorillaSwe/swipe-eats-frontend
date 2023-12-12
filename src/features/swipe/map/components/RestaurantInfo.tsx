import { useEffect, useState } from "react";

import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ConfirmationDialog from "@/components/base/ConfirmationDialog/ConfirmationDialog";
import ContactInfo from "@/components/base/RestaurantInfo/ContactInfo";
import Border from "@/components/ui/Border/Border";
import PriceLevel from "@/components/ui/PriceLevel/PriceLevel";
import StarRating from "@/components/ui/StarRating/StarRating";
import { addFavorite, deleteFavorite } from "@/lib/api/favoritesInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantInfo.module.scss";

interface RestaurantInfoProps {
  restaurant: RestaurantData;
  setRestaurants: React.Dispatch<React.SetStateAction<RestaurantData[]>>;
  clearSelectedRestaurant: () => void;
  onDialogStateChange: (isOpen: boolean) => void;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  setRestaurants,
  clearSelectedRestaurant,
  onDialogStateChange,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";
  const { user } = useUser();
  const token = useAccessToken();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);

  useEffect(() => {
    onDialogStateChange(isDialogOpen);
  }, [isDialogOpen, onDialogStateChange]);

  const handleDelete = async () => {
    if (user) {
      try {
        deleteFavorite(token, restaurant.placeId);
      } catch (error) {
        console.error("削除に失敗しました: ", error);
      }
    }
    setIsFavorite(null);
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((r) =>
        r.placeId === restaurant.placeId ? { ...r, isFavorite: null } : r
      )
    );
    setIsDialogOpen(false);
  };

  const handleAddToFavorites = async () => {
    if (user) {
      try {
        addFavorite(token, restaurant.placeId);
      } catch (error) {
        console.error("お気に入り追加に失敗しました: ", error);
      }
    }
    setIsFavorite(true);
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((r) =>
        r.placeId === restaurant.placeId ? { ...r, isFavorite: true } : r
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          src={restaurant.photos?.[0] ? restaurant.photos[0] : quotaPhoto}
          alt={restaurant.name}
          priority={true}
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
        />
        <CloseIcon
          className={styles.button}
          onClick={clearSelectedRestaurant}
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
          {isFavorite ? (
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
          )}
        </div>
      </div>
      {isDialogOpen && (
        <ConfirmationDialog
          setIsDialogOpen={() => setIsDialogOpen(false)}
          handleAction={handleDelete}
          title="お気に入りを削除しますか？"
          confirmButtonText="削除"
        />
      )}
      <Border />
      <ContactInfo restaurant={restaurant} />
    </div>
  );
};

export default RestaurantInfo;
