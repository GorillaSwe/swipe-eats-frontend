import styles from "./PriceLevel.module.scss";

interface PriceLevelProps {
  priceLevel: number;
}

const PriceLevel: React.FC<PriceLevelProps> = ({ priceLevel }) => {
  const getPriceLevelDescription = (priceLevel: number) => {
    switch (priceLevel) {
      case 0:
        return "無料";
      case 1:
        return "安価";
      case 2:
        return "お手頃";
      case 3:
        return "高級";
      case 4:
        return "贅沢";
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.priceLevel}>
        {getPriceLevelDescription(priceLevel)}
      </p>
    </div>
  );
};

export default PriceLevel;
