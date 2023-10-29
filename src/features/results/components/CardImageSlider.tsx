import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './CardImageSlider.module.scss';

interface CardImageSliderProps {
  photos: string[];
}

const CardImageSlider: React.FC<CardImageSliderProps> = ({ photos }) => {
  const sliderSettings = {
    dots: true,
    slidesToShow: 1,
    infinite: false,
  };

  const quotaPhoto = "/images/restaurants/quota.png";

  return (
    <Slider className={styles.container} {...sliderSettings}>
      {photos && photos.length > 0 ? (
        photos.map((photo, photoIndex) => (
          <div key={photoIndex} className={styles.item}>
            <div style={{ backgroundImage: 'url(' + photo + ')' }} className={styles.image}></div>
          </div>
        ))
      ) : (
        <div className={styles.item}>
          <div style={{ backgroundImage: 'url(' + quotaPhoto + ')' }} className={styles.image}></div>
        </div>
      )}
    </Slider>
  );
};

export default CardImageSlider;