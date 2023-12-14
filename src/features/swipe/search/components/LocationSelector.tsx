import { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import AddressSearchDialog from "@/features/swipe/search/components/AddressSearchDialog";

import styles from "./LocationSelector.module.scss";

interface LocationSelectorProps {
  onLocationUpdate: (lat: number, lng: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationUpdate,
}) => {
  const [buttonText, setButtonText] = useState("現在地");
  const [address, setAddress] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddressSelect = (
    name: string,
    address: string,
    lat: number,
    lng: number
  ) => {
    onLocationUpdate(lat, lng);
    setButtonText(name);
    setAddress(address);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>検索地点</h3>
      <label className={`${styles.label} ${styles.selected}`}>
        <input
          className={styles.button}
          onClick={() => setIsDialogOpen(true)}
        />
        <p className={styles.text}>
          {buttonText}
          <KeyboardArrowDownIcon />
        </p>
      </label>
      {isDialogOpen && (
        <AddressSearchDialog
          buttonText={buttonText}
          address={address}
          setIsDialogOpen={() => setIsDialogOpen(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
    </div>
  );
};

export default LocationSelector;
