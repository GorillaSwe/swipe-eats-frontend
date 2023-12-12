import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ReplayIcon from "@mui/icons-material/Replay";

import styles from "./CardButtons.module.scss";

interface CardButtonsProps {
  canSwipe: boolean;
  canGoBack: boolean;
  swipe: (direction: string) => void;
  goBack: () => void;
  onLastCardSwipe: () => void;
}

interface CardButtonProps {
  className: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

const CardButton: React.FC<CardButtonProps> = ({
  className,
  onClick,
  disabled,
  children,
}) => (
  <div
    className={`${styles.button} ${className} ${disabled ? styles.cannot : ""}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardButtons: React.FC<CardButtonsProps> = ({
  canSwipe,
  canGoBack,
  swipe,
  goBack,
  onLastCardSwipe,
}) => {
  return (
    <div className={styles.container}>
      <CardButton
        className={styles.back}
        onClick={goBack}
        disabled={!canGoBack}
      >
        <ReplayIcon fontSize="large" />
      </CardButton>
      <CardButton
        className={styles.nope}
        onClick={() => swipe("left")}
        disabled={!canSwipe}
      >
        <CloseIcon fontSize="large" />
      </CardButton>
      <CardButton
        className={styles.like}
        onClick={() => swipe("right")}
        disabled={!canSwipe}
      >
        <FavoriteIcon fontSize="large" />
      </CardButton>
      <CardButton
        className={styles.skip}
        onClick={onLastCardSwipe}
        disabled={false}
      >
        <KeyboardDoubleArrowRightIcon fontSize="large" />
      </CardButton>
    </div>
  );
};

export default CardButtons;
