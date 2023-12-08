import { useEffect, useRef } from "react";

import styles from "./UnfollowDialog.module.scss";

interface UnfollowDialogProps {
  setIsDialogOpen: () => void;
  handleUnfollow: () => void;
}

const UnfollowDialog: React.FC<UnfollowDialogProps> = ({
  setIsDialogOpen,
  handleUnfollow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDialogOpen();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDialogOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.dialog} ref={containerRef}>
        <p className={styles.title}>フォローを解除しますか？</p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={setIsDialogOpen}>
            キャンセル
          </button>
          <button className={styles.deleteButton} onClick={handleUnfollow}>
            フォロー解除
          </button>
        </div>
      </div>
      <div className={styles.nonScroll}></div>
    </div>
  );
};

export default UnfollowDialog;
