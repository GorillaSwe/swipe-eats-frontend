import { MarkerF } from "@react-google-maps/api";

import { RestaurantData } from "@/types/RestaurantData";

interface SelectedMarkerProps {
  selectedRestaurant: RestaurantData | null;
}

const SelectedMarker: React.FC<SelectedMarkerProps> = ({
  selectedRestaurant,
}) => {
  return (
    <>
      {selectedRestaurant && (
        <MarkerF
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.lng,
          }}
        ></MarkerF>
      )}
    </>
  );
};

export default SelectedMarker;
