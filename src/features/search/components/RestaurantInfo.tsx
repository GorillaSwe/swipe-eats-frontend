import { useRef, useEffect, useState } from "react";

import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import CloseIcon from "@mui/icons-material/Close";
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
  selectedRestaurant: RestaurantData;
  setSelectedRestaurant: React.Dispatch<
    React.SetStateAction<RestaurantData | null>
  >;
  setRestaurants: React.Dispatch<React.SetStateAction<RestaurantData[]>>;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  selectedRestaurant,
  setSelectedRestaurant,
  setRestaurants,
}) => {
  const quotaPhoto = "/images/restaurants/quota.png";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(selectedRestaurant.isFavorite);
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

  const handleDelete = async () => {
    try {
      const tokenResponse = await fetch("/api/token");
      const tokenData = await tokenResponse.json();
      const token = tokenData.accessToken;

      await client.delete(
        `/favorites/destroy_by_place_id/${selectedRestaurant.placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(false);

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === selectedRestaurant.placeId
            ? { ...r, isFavorite: false }
            : r
        )
      );
    } catch (error) {
      console.error("削除に失敗しました: ", error);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const tokenResponse = await fetch("/api/token");
      const tokenData = await tokenResponse.json();
      const token = tokenData.accessToken;

      await client.post(
        `/favorites`,
        { placeId: selectedRestaurant.placeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(true);

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === selectedRestaurant.placeId
            ? { ...r, isFavorite: true }
            : r
        )
      );
    } catch (error) {
      console.error("お気に入り追加に失敗しました: ", error);
    }
  };

  const getHostnameFromUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      console.error("URL解析エラー: ", error);
      return urlString;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.restaurantContainer} ref={containerRef}>
        <div className={styles.image}>
          <Image
            src={
              selectedRestaurant.photos && selectedRestaurant.photos[0]
                ? selectedRestaurant.photos[0]
                : quotaPhoto
            }
            alt={selectedRestaurant.name}
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
          <h3 className={styles.name}>{selectedRestaurant.name}</h3>
          <div className={styles.subContainer}>
            <div className={styles.subLeftContainer}>
              <p className={styles.rating}>{selectedRestaurant.rating}</p>
              <StarRating rating={selectedRestaurant.rating} />
              <p className={styles.userRatingsTotal}>
                ({selectedRestaurant.userRatingsTotal})
              </p>
              {selectedRestaurant.priceLevel && <p>・</p>}
              <PriceLevel priceLevel={selectedRestaurant.priceLevel} />
            </div>
            <div className={styles.subRightContainer}>
              {user &&
                (isFavorite ? (
                  <FavoriteIcon
                    className={styles.favoriteDialogIcon}
                    onClick={toggleDialog}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className={styles.deleteDialogIcon}
                    onClick={handleAddToFavorites}
                  />
                ))}
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
              <p className={styles.postalCode}>
                〒{selectedRestaurant.postalCode}
              </p>
              <p className={styles.vicinity}>{selectedRestaurant.vicinity}</p>
            </div>
          </div>
          {selectedRestaurant.website && (
            <div className={styles.iconContainer}>
              <PublicIcon />
              <div className={styles.textContainer}>
                <p className={styles.website}>
                  <a href={selectedRestaurant.website} target="_blank">
                    {getHostnameFromUrl(selectedRestaurant.website)}
                  </a>
                </p>
              </div>
            </div>
          )}
          {selectedRestaurant.url && (
            <div className={styles.iconContainer}>
              <GoogleIcon />
              <p className={styles.url}>
                <a href={selectedRestaurant.url} target="_blank">
                  Google Mapで表示
                </a>
              </p>
            </div>
          )}
          {selectedRestaurant.formattedPhoneNumber && (
            <div className={styles.iconContainer}>
              <PhoneIcon />
              <p className={styles.formattedPhoneNumber}>
                {selectedRestaurant.formattedPhoneNumber}
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
