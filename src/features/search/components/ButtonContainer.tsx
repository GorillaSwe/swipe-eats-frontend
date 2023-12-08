import styles from "./ButtonContainer.module.scss"; // 適切なスタイルを定義してください

interface ButtonContainerProps {
  filter: string;
  setFilter: (string: string) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <div className={styles.container}>
      <button
        onClick={() => setFilter("restaurants")}
        className={`${styles.button} ${
          filter === "restaurants" ? styles.active : ""
        }`}
      >
        レストラン
      </button>
      <button
        onClick={() => setFilter("users")}
        className={`${styles.button} ${
          filter === "users" ? styles.active : ""
        }`}
      >
        ユーザー
      </button>
    </div>
  );
};

export default ButtonContainer;
