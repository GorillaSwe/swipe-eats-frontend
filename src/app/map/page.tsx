"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, MarkerF, CircleF, InfoWindowF } from '@react-google-maps/api'
import { useRestaurantData } from '@/contexts/RestaurantContext';
import { RestaurantData } from "@/types/RestaurantData";
import styles from './page.module.css';
import RestaurantInfo from "@/features/map/components/RestaurantInfo";

const DEFAULT_CENTER = {
  lat: 35.5649221,
  lng: 139.6559956,
};

const USER_MARKER_ICON = "/images/map/user.png";
const LIKE_MARKER_ICON = "/images/map/heart.png";
const NOPE_MARKER_ICON = "/images/map/cross.png";
const OTHER_MARKER_ICON = "https://labs.google.com/ridefinder/images/mm_20_black.png";

const MapPage: React.FC = () => {
  const restaurantData = useRestaurantData();
  const restaurants = restaurantData.restaurantsWithDirection
  const latitude = restaurantData.latitude
  const longitude = restaurantData.longitude
  const radius = restaurantData.radius || 500;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | RestaurantData>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<null | RestaurantData>(null);

  const center = {
    lat: latitude ?? DEFAULT_CENTER.lat,
    lng: longitude ?? DEFAULT_CENTER.lng
  };

  const [mapCenter, setMapCenter] = useState(center);

  const containerStyle = {
    width: '90vw',
    height: '80vh',
  }

  const getMarkerIcon = (direction: string) => {
    switch (direction) {
      case "right":
        return LIKE_MARKER_ICON
      case "left":
        return NOPE_MARKER_ICON
      default:
        return OTHER_MARKER_ICON
    }
  };

  type ZoomLevels = {
    [key: number]: number;
    default: number;
  };

  const ZOOM_LEVELS: ZoomLevels = {
    100: 18,
    500: 17,
    1000: 16,
    2000: 15,
    3000: 14,
    4000: 14,
    5000: 13,
    default: 16,
  };

  const getZoomSize = (radius: number) => {
    return ZOOM_LEVELS[radius] || ZOOM_LEVELS.default;
  }

  return (
    <div className={styles.container}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={getZoomSize(radius)}
        >
          <CircleF
            center={center}
            radius={radius}
            options={{
              strokeColor: '#115EC3',
              strokeOpacity: 0.2,
              strokeWeight: 1,
              fillColor: '#115EC3',
              fillOpacity: 0.2,
            }}
          />
          <MarkerF
            position={center}
            icon={USER_MARKER_ICON}
          />
          {restaurants?.map((restaurant, index) => (
            restaurant !== selectedRestaurant && (
              <MarkerF
                key={restaurant.placeId}
                position={{
                  lat: restaurant.lat,
                  lng: restaurant.lng,
                }}
                icon={getMarkerIcon(restaurant.direction)}
                onClick={() => {
                  setSelectedRestaurant(restaurant)
                }}
                onMouseOver={() => setHoveredRestaurant(restaurant)}
                onMouseOut={() => setHoveredRestaurant(null)}
              >
                {(restaurant.direction === "right" && (hoveredRestaurant === null || hoveredRestaurant === restaurant)) && (
                  <InfoWindowF
                    position={{
                      lat: restaurant.lat,
                      lng: restaurant.lng,
                    }}
                  >
                    <div className={`${styles.infoWindowContent} ${hoveredRestaurant === restaurant ? styles.hovered : ''}`}
                      onMouseOver={() => setHoveredRestaurant(restaurant)}
                      onMouseOut={() => setHoveredRestaurant(null)}
                      onClick={(event) => {
                        setHoveredRestaurant(null)
                        setSelectedRestaurant(restaurant)
                      }}
                    >
                      {restaurant.name}
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            )
          ))}
          {selectedRestaurant && (
            <>
              <MarkerF
                position={{
                  lat: selectedRestaurant.lat,
                  lng: selectedRestaurant.lng,
                }}
                onMouseOver={() => setHoveredRestaurant(selectedRestaurant)}
                onMouseOut={() => setHoveredRestaurant(null)}
              >
                {(selectedRestaurant.direction === "right") && (
                  <InfoWindowF
                    position={{
                      lat: selectedRestaurant.lat,
                      lng: selectedRestaurant.lng,
                    }}
                  >
                    <div className={`${styles.selectedInfoWindowContent} ${hoveredRestaurant === selectedRestaurant ? styles.hovered : ''}`}
                      onMouseOver={() => setHoveredRestaurant(selectedRestaurant)}
                      onMouseOut={() => setHoveredRestaurant(null)}
                    >
                      {selectedRestaurant.name}
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
              <RestaurantInfo restaurant={selectedRestaurant} />
            </>
          )}
        </GoogleMap >
      </LoadScript>
    </div >
  );
};
export default MapPage;
