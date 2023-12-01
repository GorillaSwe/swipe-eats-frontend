import Link from "next/link";

import styles from "./LoginSection.module.scss";

const LoginSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ログインが必要です</h1>
      <Link href="/api/auth/login" className={styles.button}>
        ログインする
      </Link>
    </div>
  );
};

export default LoginSection;
