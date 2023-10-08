import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialWidth = `${(rating % 1) * 100}%`;

  return (
    <div className={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className={styles.full}>★</span>
      ))}
      {hasPartialStar && (
        <div className={styles.partialContainer}>
          <span className={styles.grey}>★</span>
          <span className={styles.overlay} style={{ width: partialWidth }}>★</span>
        </div>
      )}
      {[...Array(totalStars - fullStars - (hasPartialStar ? 1 : 0))].map((_, i) => (
        <span key={i + fullStars} className={styles.grey}>★</span>
      ))}
    </div>
  );
};

export default StarRating;