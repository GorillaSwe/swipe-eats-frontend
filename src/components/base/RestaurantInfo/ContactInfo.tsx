import GoogleIcon from "@mui/icons-material/Google";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";

import { RestaurantData } from "@/types/RestaurantData";

import styles from "./ContactInfo.module.scss";

interface ContactInfoProps {
  restaurant: RestaurantData;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ restaurant }) => {
  const getHostnameFromUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      console.error("URL解析エラー: ", error);
      return urlString;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <LocationOnIcon />
        <p>
          〒{restaurant.postalCode} {restaurant.vicinity}
        </p>
      </div>
      {restaurant.website && (
        <div className={styles.iconContainer}>
          <PublicIcon />
          <a href={restaurant.website} target="_blank">
            {getHostnameFromUrl(restaurant.website)}
          </a>
        </div>
      )}
      {restaurant.url && (
        <div className={styles.iconContainer}>
          <GoogleIcon />
          <a href={restaurant.url} target="_blank">
            Google Mapで表示
          </a>
        </div>
      )}
      {restaurant.formattedPhoneNumber && (
        <div className={styles.iconContainer}>
          <PhoneIcon />
          <p>{restaurant.formattedPhoneNumber}</p>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
