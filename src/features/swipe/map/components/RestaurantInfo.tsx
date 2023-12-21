import { useEffect, useState } from "react";

import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ConfirmationDialog from "@/components/base/ConfirmationDialog/ConfirmationDialog";
import CommentDialog from "@/components/base/RestaurantInfo/CommentDialog";
import ContactInfo from "@/components/base/RestaurantInfo/ContactInfo";
import Border from "@/components/ui/Border/Border";
import PriceLevel from "@/components/ui/PriceLevel/PriceLevel";
import StarRating from "@/components/ui/StarRating/StarRating";
import UserStarRating from "@/components/ui/StarRating/UserStarRating";
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
  const [isFavorite, setIsFavorite] = useState(restaurant.direction);
  const [userName, setUserName] = useState(restaurant.userName);
  const [userPicture, setUserPicture] = useState(restaurant.userPicture);
  const [userRating, setUserRating] = useState(restaurant.userRating || 0);
  const [userComment, setUserComment] = useState(restaurant.userComment);
  const [hasUserUpdated, setHasUserUpdated] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const CommentButtonTitle = userComment ? "メモを編集" : "メモを追加";

  useEffect(() => {
    onDialogStateChange(isDialogOpen);
  }, [isDialogOpen, onDialogStateChange]);

  const handleDelete = async () => {
    if (user && !restaurant.isFavorite) {
      try {
        deleteFavorite(token, restaurant.placeId);
      } catch (error) {
        console.error("削除に失敗しました: ", error);
      }
    }
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((r) =>
        r.placeId === restaurant.placeId ? { ...r, direction: null } : r
      )
    );
    setIsFavorite(null);
    setIsDialogOpen(false);
    console.log(restaurant);
  };

  const handleAddToFavorites = async () => {
    if (user && !restaurant.isFavorite) {
      try {
        const favoriteData = await addFavorite(
          token,
          restaurant.placeId,
          null,
          null
        );
        setUserName(favoriteData.userName);
        setUserPicture(favoriteData.userPicture);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((r) =>
            r.placeId === restaurant.placeId
              ? {
                  ...r,
                  userName: favoriteData.userName,
                  userPicture: favoriteData.userPicture,
                }
              : r
          )
        );
      } catch (error) {
        console.error("お気に入り追加に失敗しました: ", error);
      }
    }
    setIsFavorite(true);
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((r) =>
        r.placeId === restaurant.placeId ? { ...r, direction: true } : r
      )
    );
  };

  const updateFavorites = async () => {
    try {
      await addFavorite(token, restaurant.placeId, userRating, userComment);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.placeId === restaurant.placeId
            ? {
                ...r,
                userRating: userRating,
                userComment: userComment,
              }
            : r
        )
      );
    } catch (error) {
      console.error("お気に入り更新に失敗しました: ", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    setUserRating(newRating);
    setHasUserUpdated(true);
  };

  const handleCommentChange = async (newComment: string) => {
    setUserComment(newComment);
    setHasUserUpdated(true);
  };

  useEffect(() => {
    const updateFavorite = async () => {
      if (hasUserUpdated) {
        await updateFavorites();
        setHasUserUpdated(false);
      }
    };
    updateFavorite();
  }, [userRating, userComment, updateFavorites, hasUserUpdated]);

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

      {isFavorite && user && (
        <>
          <div className={styles.favoriteContainer}>
            <div className={styles.userContainer}>
              <Image
                src={userPicture}
                alt={userName}
                className={styles.userPicture}
                width={30}
                height={30}
              />
              <p className={styles.userName}>{userName}</p>
            </div>
            <div className={styles.ratingContainer}>
              <UserStarRating
                userRating={userRating}
                setUserRating={handleRatingChange}
                displayFavorite={true}
              />
              <p className={styles.rating}>{userRating}</p>
            </div>
          </div>
          <div className={styles.commentContainer}>
            <p className={styles.commentText}>{userComment}</p>
            <button
              className={styles.commentButton}
              onClick={() => {
                setIsCommentDialogOpen(true);
              }}
            >
              {CommentButtonTitle}
            </button>
          </div>
          {isCommentDialogOpen && (
            <CommentDialog
              name={restaurant.name}
              comment={userComment}
              setIsDialogOpen={() => setIsCommentDialogOpen(false)}
              onSubmitComment={handleCommentChange}
            />
          )}
        </>
      )}
      <Border />
      <ContactInfo restaurant={restaurant} />
    </div>
  );
};

export default RestaurantInfo;
