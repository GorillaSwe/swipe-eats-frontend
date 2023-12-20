import styles from "./UserStarRating.module.scss";

interface UserStarRatingProps {
  userRating: number;
  setUserRating: (rating: number) => void;
  displayFavorite: boolean;
}

const UserStarRating: React.FC<UserStarRatingProps> = ({
  userRating,
  setUserRating,
  displayFavorite,
}) => {
  const totalStars = 5;

  const handleStarClick = (rating: number) => {
    if (displayFavorite) {
      setUserRating(rating);
    }
  };

  return (
    <div className={styles.container}>
      {[...Array(totalStars)].map((_, index) => (
        <span
          key={index}
          className={userRating > index ? styles.gold : styles.grey}
          onClick={() => handleStarClick(index + 1)}
          style={{ cursor: displayFavorite ? "pointer" : "default" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default UserStarRating;
