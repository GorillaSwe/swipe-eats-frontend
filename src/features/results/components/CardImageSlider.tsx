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
    dots: false,
    slidesToShow: 1,
    infinite: false,
    useCSS: false,
  };

  return (
    <Slider className={styles.container} {...sliderSettings}>
      {photos ? (
        photos.map((photo, photoIndex) => (
          <div key={photoIndex} className={styles.item}>
            <div style={{ backgroundImage: 'url(' + photo + ')' }} className={styles.image}></div>
          </div>
        ))
      ) : (
        <p>No photos available</p>
      )}
    </Slider>
  );
};

export default CardImageSlider;