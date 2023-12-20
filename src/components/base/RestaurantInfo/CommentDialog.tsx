import React, { useEffect, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

import NonScroll from "@/components/ui/NonScroll/NonScroll";

import styles from "./CommentDialog.module.scss";

interface CommentDialogProps {
  name: string;
  comment: string;
  setIsDialogOpen: () => void;
  onSubmitComment: (comment: string) => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  name,
  comment,
  setIsDialogOpen,
  onSubmitComment,
}) => {
  const [commentText, setCommentText] = useState(comment);
  const containerRef = useRef<HTMLDivElement>(null);

  const dialogTitle = comment ? "メモを編集" : "メモを追加";

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

  const handleSave = () => {
    onSubmitComment(commentText);
    setIsDialogOpen();
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog} ref={containerRef}>
        <CloseIcon className={styles.close} onClick={() => setIsDialogOpen()} />
        <h3 className={styles.title}>{dialogTitle}</h3>
        <h3 className={styles.name}>{name}</h3>
        <textarea
          className={styles.textarea}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className={styles.buttons}>
          <button onClick={handleSave} className={styles.button}>
            完了
          </button>
        </div>
      </div>
      <NonScroll />
    </div>
  );
};

export default CommentDialog;
