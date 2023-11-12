import { MarkerF } from "@react-google-maps/api";

import { RestaurantData } from "@/types/RestaurantData";

interface SelectedMarkerProps {
  selectedRestaurant: RestaurantData | null;
  setHoveredRestaurant: (selectedRestaurant: RestaurantData | null) => void;
}

const SelectedMarker: React.FC<SelectedMarkerProps> = ({
  selectedRestaurant,
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
        ></MarkerF>
      )}
    </>
  );
};

export default SelectedMarker;
