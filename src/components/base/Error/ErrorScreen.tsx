import Link from "next/link";

import styles from "./ErrorScreen.module.scss";

type LoginScreenProps = {
  error: string | null;
  category: string;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ error, category }) => {
  const errorMessage = error || "レストランが見つかりません";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{errorMessage}</h1>
      <Link
        href={`/swipe/search/?category=${category}`}
        className={styles.button}
      >
        検索条件を変更
      </Link>
    </div>
  );
};

export default LoginScreen;
