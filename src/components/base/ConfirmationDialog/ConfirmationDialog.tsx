import { useEffect, useRef } from "react";

import NonScroll from "@/components/ui/NonScroll";

import styles from "./ConfirmationDialog.module.scss";

interface ConfirmationDialogProps {
  setIsDialogOpen: () => void;
  handleAction: () => void;
  title: string;
  confirmButtonText: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  setIsDialogOpen,
  handleAction,
  title,
  confirmButtonText,
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
        <p className={styles.title}>{title}</p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={setIsDialogOpen}>
            キャンセル
          </button>
          <button className={styles.actionButton} onClick={handleAction}>
            {confirmButtonText}
          </button>
        </div>
      </div>
      <NonScroll />
    </div>
  );
};

export default ConfirmationDialog;
