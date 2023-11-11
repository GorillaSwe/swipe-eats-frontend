import { MarkerF, InfoWindowF } from "@react-google-maps/api";

import { RestaurantData } from "@/types/RestaurantData";

import styles from "./SelectedMarker.module.scss";

interface SelectedMarkerProps {
  selectedRestaurant: RestaurantData | null;
  hoveredRestaurant: RestaurantData | null;
  setHoveredRestaurant: (selectedRestaurant: RestaurantData | null) => void;
}

const SelectedMarker: React.FC<SelectedMarkerProps> = ({
  selectedRestaurant,
  hoveredRestaurant,
  setHoveredRestaurant,
}) => {
  return (
    <>
      {selectedRestaurant && (
        <MarkerF
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.lng,
          }}
          onMouseOver={() => setHoveredRestaurant(selectedRestaurant)}
          onMouseOut={() => setHoveredRestaurant(null)}
        >
          <InfoWindowF
            position={{
              lat: selectedRestaurant.lat,
              lng: selectedRestaurant.lng,
            }}
          >
            <div
              className={styles.infoWindow}
              onMouseOver={() => setHoveredRestaurant(selectedRestaurant)}
              onMouseOut={() => setHoveredRestaurant(null)}
            >
              {selectedRestaurant.name}
            </div>
          </InfoWindowF>
        </MarkerF>
      )}
    </>
  );
};

export default SelectedMarker;
