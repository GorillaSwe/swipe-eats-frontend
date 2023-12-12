import Image from "next/image";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./CardImageSlider.module.scss";

interface CardImageSliderProps {
  photos: string[];
}

const CardImage: React.FC<{ photo: string }> = ({ photo }) => (
  <div className={styles.item}>
    <Image
      src={photo}
      alt="Restaurant Image"
      width={580}
      height={500}
      priority={true}
      className={styles.image}
    />
  </div>
);

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
        photos.map((photo, index) => <CardImage key={index} photo={photo} />)
      ) : (
        <CardImage photo={quotaPhoto} />
      )}
    </Slider>
  );
};

export default CardImageSlider;
