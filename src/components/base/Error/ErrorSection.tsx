import Link from "next/link";

import styles from "./ErrorSection.module.scss";

type ErrorSectionProps = {
  error: string | null;
  category: string | null;
};

const ErrorSection: React.FC<ErrorSectionProps> = ({ error, category }) => {
  const errorMessage = error || "レストランが見つかりません";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{errorMessage}</h1>
      {category ? (
        <Link
          href={`/swipe/search/?category=${category}`}
          className={styles.button}
        >
          検索条件を変更
        </Link>
      ) : (
        <Link href={`/`} className={styles.button}>
          検索条件を変更
        </Link>
      )}
    </div>
  );
};

export default ErrorSection;
