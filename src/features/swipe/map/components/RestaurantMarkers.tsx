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
const NULL_MARKER_ICON = "/images/map/null.png";

const getMarkerIcon = (isFavorite: boolean | null) => {
  if (isFavorite === true) {
    return LIKE_MARKER_ICON;
  } else {
    return NULL_MARKER_ICON;
  }
};

const RestaurantMarkers: React.FC<RestaurantMarkersProps> = ({
  restaurants,
  selectedRestaurant,
  hoveredRestaurant,
  setHoveredRestaurant,
  setSelectedRestaurant,
}) => {
  return (
    <>
      {restaurants?.map((restaurant) => {
        if (restaurant === selectedRestaurant) return null;
        return (
          <MarkerF
            key={restaurant.placeId}
            position={{
              lat: restaurant.lat,
              lng: restaurant.lng,
            }}
            icon={getMarkerIcon(restaurant.isFavorite)}
            onClick={() => {
              setSelectedRestaurant(restaurant);
            }}
            onMouseOver={() => setHoveredRestaurant(restaurant)}
            onMouseOut={() => setHoveredRestaurant(null)}
          >
            {hoveredRestaurant === restaurant && (
              <InfoWindowF
                position={{
                  lat: restaurant.lat,
                  lng: restaurant.lng,
                }}
              >
                <div className={styles.infoWindow}>{restaurant.name}</div>
              </InfoWindowF>
            )}
          </MarkerF>
        );
      })}
    </>
  );
};

export default RestaurantMarkers;
