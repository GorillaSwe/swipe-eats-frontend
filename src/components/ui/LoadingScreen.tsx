import styles from './LoadingScreen.module.scss';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingScreen;
