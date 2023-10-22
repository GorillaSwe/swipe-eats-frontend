import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import UndoIcon from "@mui/icons-material/Undo";
import styles from './CardButtons.module.scss';

interface CardButtonsProps {
  canSwipe: boolean;
  canGoBack: boolean;
  swipe: (direction: string) => void;
  goBack: () => void;
}

const CardButtons: React.FC<CardButtonsProps> = ({ canSwipe, canGoBack, swipe, goBack }) => {
  return (
    <div className={styles.container}>
      <IconButton style={{ backgroundColor: canSwipe ? '#9198e5' : '#c3c4d3' }} onClick={() => swipe('left')}>
        <CloseIcon fontSize="large" />
      </IconButton>
      <IconButton style={{ backgroundColor: canGoBack ? '#9198e5' : '#c3c4d3' }} onClick={() => goBack()}>
        <UndoIcon fontSize="large" />
      </IconButton>
      <IconButton style={{ backgroundColor: canSwipe ? '#9198e5' : '#c3c4d3' }} onClick={() => swipe('right')}>
        <FavoriteIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default CardButtons;