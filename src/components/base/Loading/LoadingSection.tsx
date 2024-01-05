import styles from "./LoadingSection.module.scss";

const LoadingSection: React.FC = () => {
  return (
    <div className={styles.container} data-testid="loading-section">
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingSection;
