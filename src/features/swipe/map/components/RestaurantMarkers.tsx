import { MarkerF, InfoWindowF } from "@react-google-maps/api";

import { RestaurantData } from "@/types/RestaurantData";

import styles from "./RestaurantMarkers.module.scss";

interface RestaurantMarkersProps {
  restaurants: RestaurantData[];
  selectedRestaurant: RestaurantData | null;
  hoveredRestaurant: RestaurantData | null;
  setHoveredRestaurant: (selectedRestaurant: RestaurantData | null) => void;
  setSelectedRestaurant: (hoveredRestaurant: RestaurantData | null) => void;
}

const LIKE_MARKER_ICON = "/images/map/heart.png";
const NOPE_MARKER_ICON = "/images/map/cross.png";
const OTHER_MARKER_ICON =
  "https://labs.google.com/ridefinder/images/mm_20_black.png";

const RestaurantMarkers: React.FC<RestaurantMarkersProps> = ({
  restaurants,
  selectedRestaurant,
  hoveredRestaurant,
  setHoveredRestaurant,
  setSelectedRestaurant,
}) => {
  const getMarkerIcon = (direction: string) => {
    switch (direction) {
      case "right":
        return LIKE_MARKER_ICON;
      case "left":
        return NOPE_MARKER_ICON;
      default:
        return OTHER_MARKER_ICON;
    }
  };

  return (
    <>
      {restaurants?.map(
        (restaurant, index) =>
          restaurant !== selectedRestaurant &&
          restaurant.direction === "right" && (
            <MarkerF
              key={restaurant.placeId}
              position={{
                lat: restaurant.lat,
                lng: restaurant.lng,
              }}
              icon={getMarkerIcon(restaurant.direction)}
              onClick={() => {
                setSelectedRestaurant(restaurant);
              }}
              onMouseOver={() => setHoveredRestaurant(restaurant)}
              onMouseOut={() => setHoveredRestaurant(null)}
            >
              {restaurant.direction === "right" &&
                (hoveredRestaurant === null ||
                  hoveredRestaurant === restaurant) && (
                  <InfoWindowF
                    position={{
                      lat: restaurant.lat,
                      lng: restaurant.lng,
                    }}
                  >
                    <div
                      className={`${styles.infoWindow} ${
                        hoveredRestaurant === restaurant ? styles.hovered : ""
                      }`}
                      onMouseOver={() => setHoveredRestaurant(restaurant)}
                      onMouseOut={() => setHoveredRestaurant(null)}
                      onClick={(event) => {
                        setHoveredRestaurant(null);
                        setSelectedRestaurant(restaurant);
                      }}
                    >
                      {restaurant.name}
                    </div>
                  </InfoWindowF>
                )}
            </MarkerF>
          )
      )}
    </>
  );
};

export default RestaurantMarkers;
