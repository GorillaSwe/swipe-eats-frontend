import { useEffect, useRef } from "react";

import styles from "./DeleteDialog.module.scss";

interface DeleteDialogProps {
  setIsDialogOpen: () => void;
  handleDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  setIsDialogOpen,
  handleDelete,
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
        <p className={styles.title}>お気に入りを削除しますか？</p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={setIsDialogOpen}>
            キャンセル
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            削除
          </button>
        </div>
      </div>
      <div className={styles.nonScroll}></div>
    </div>
  );
};

export default DeleteDialog;
