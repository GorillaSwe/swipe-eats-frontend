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
}

const CardButtons: React.FC<CardButtonsProps> = ({
  canSwipe,
  canGoBack,
  swipe,
  goBack,
}) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.button} ${styles.back} ${
          canGoBack ? "" : styles.cannot
        }`}
        onClick={() => goBack()}
      >
        <ReplayIcon fontSize="large" />
      </div>
      <div
        className={`${styles.button} ${styles.nope} ${
          canSwipe ? "" : styles.cannot
        }`}
        onClick={() => swipe("left")}
      >
        <CloseIcon fontSize="large" />
      </div>
      <div
        className={`${styles.button} ${styles.like} ${
          canSwipe ? "" : styles.cannot
        }`}
        onClick={() => swipe("right")}
      >
        <FavoriteIcon fontSize="large" />
      </div>

      <div
        className={`${styles.button} ${styles.skip} `}
        onClick={() => goBack()}
      >
        <KeyboardDoubleArrowRightIcon fontSize="large" />
      </div>
    </div>
  );
};

export default CardButtons;
