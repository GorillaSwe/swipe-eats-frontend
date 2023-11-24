import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GoogleIcon from "@mui/icons-material/Google";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";

import PriceLevel from "@/components/ui/PriceLevel";
import StarRating from "@/components/ui/StarRating";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantInfo.module.scss";

interface RestaurantInfoProps {
  restaurant: RestaurantData;
  setSelectedRestaurant: (restaurant: RestaurantData | null) => void;
  setDirectionsResult: (
    directionsResult: google.maps.DirectionsResult | null
  ) => void;
  setTravelTime: (travelTime: string | null) => void;
  setPreviousPlaceId: (previousPlaceId: string | null) => void;
  setRestaurants: React.Dispatch<React.SetStateAction<RestaurantData[]>>;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  setSelectedRestaurant,
  setDirectionsResult,
  setTravelTime,
  setPreviousPlaceId,
  setRestaurants,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);
  const { user } = useUser();

  const toggleDialog = () => setIsDialogOpen((prev) => !prev);

  useEffect(() => {
    const closeDialog = (e: MouseEvent) => {
      if (isDialogOpen) setIsDialogOpen(false);
    };

    document.addEventListener("click", closeDialog);
    return () => document.removeEventListener("click", closeDialog);
  }, [isDialogOpen]);

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

  const getHostnameFromUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      console.error("URL解析エラー: ", error);
      return urlString;
    }
  };

  const handleDelete = async () => {
    if (user) {
      try {
        const tokenResponse = await fetch("/api/token");
        const tokenData = await tokenResponse.json();
        const token = tokenData.accessToken;

        await client.delete(
          `/favorites/destroy_by_place_id/${restaurant.placeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(null);

        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((r) =>
            r.placeId === restaurant.placeId ? { ...r, isFavorite: null } : r
          )
        );
      } catch (error) {
        console.error("削除に失敗しました: ", error);
      }
    } else {
      setIsFavorite(null);

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === restaurant.placeId ? { ...r, isFavorite: null } : r
        )
      );
    }
  };

  const handleAddToFavorites = async () => {
    if (user) {
      try {
        const tokenResponse = await fetch("/api/token");
        const tokenData = await tokenResponse.json();
        const token = tokenData.accessToken;

        await client.post(
          `/favorites`,
          { placeId: restaurant.placeId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(true);

        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((r) =>
            r.placeId === restaurant.placeId ? { ...r, isFavorite: true } : r
          )
        );
      } catch (error) {
        console.error("お気に入り追加に失敗しました: ", error);
      }
    } else {
      setIsFavorite(true);

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === restaurant.placeId ? { ...r, isFavorite: true } : r
        )
      );
    }
  };

  return (
    <div className={styles.container}>
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
          <div className={styles.subLeftContainer}>
            <p className={styles.rating}>{restaurant.rating}</p>
            <StarRating rating={restaurant.rating} />
            <p className={styles.userRatingsTotal}>
              ({restaurant.userRatingsTotal})
            </p>
            {restaurant.priceLevel && <p>・</p>}
            <PriceLevel priceLevel={restaurant.priceLevel} />
          </div>
          <div className={styles.subRightContainer}>
            {isFavorite ? (
              <FavoriteIcon
                className={styles.favoriteDialogIcon}
                onClick={toggleDialog}
              />
            ) : (
              <FavoriteBorderIcon
                className={styles.deleteDialogIcon}
                onClick={handleAddToFavorites}
              />
            )}
            <div
              className={styles.deleteContainer}
              style={{ display: isDialogOpen ? "flex" : "none" }}
            >
              <div className={styles.deleteDialog}>
                <div className={styles.deleteDialogTopContainer}>
                  <p className={styles.deleteTitle}>
                    お気に入りを削除しますか？
                  </p>
                </div>
                <div className={styles.deleteDialogBottomContainer}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                  >
                    削除
                  </button>
                </div>
              </div>
              <div className={styles.nonScroll}></div>
            </div>
          </div>
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
                  {getHostnameFromUrl(restaurant.website)}
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
  );
};

export default RestaurantInfo;
