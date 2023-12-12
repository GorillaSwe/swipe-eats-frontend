import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

import { RestaurantData } from "@/types/RestaurantData";

interface DirectionsProps {
  center: {
    lat: number;
    lng: number;
  };
  selectedRestaurant: RestaurantData | null;
  directionsResult: google.maps.DirectionsResult | null;
  handleDirectionsCallback: (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => void;
}

const Directions: React.FC<DirectionsProps> = ({
  center,
  selectedRestaurant,
  directionsResult,
  handleDirectionsCallback,
}) => {
  const serviceOptions = selectedRestaurant
    ? {
        origin: center,
        destination: {
          lat: selectedRestaurant.lat,
          lng: selectedRestaurant.lng,
        },
        travelMode: google.maps.TravelMode.WALKING,
      }
    : null;

  return (
    <>
      {serviceOptions && (
        <DirectionsService
          options={serviceOptions}
          callback={handleDirectionsCallback}
        />
      )}
      {directionsResult && (
        <DirectionsRenderer
          options={{
            suppressMarkers: true,
            preserveViewport: true,
            directions: directionsResult,
          }}
        />
      )}
    </>
  );
};

export default Directions;
