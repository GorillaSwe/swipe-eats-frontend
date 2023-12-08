import styles from "./PartialLoadingSection.module.scss";

const PartialLoadingSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default PartialLoadingSection;
