"use client";

import { useState } from "react";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { NextPage } from "next";

import { useRestaurantData } from "@/contexts/RestaurantContext";
import Directions from "@/features/map/components/Directions";
import RestaurantInfo from "@/features/map/components/RestaurantInfo";
import RestaurantListItem from "@/features/map/components/RestaurantListItem";
import RestaurantMarkers from "@/features/map/components/RestaurantMarkers";
import SelectedMarker from "@/features/map/components/SelectedMarker";
import UserMarker from "@/features/map/components/UserMaker";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const DEFAULT_CENTER = {
  lat: 35.5649221,
  lng: 139.6559956,
};

const MapPage: NextPage = () => {
  const restaurantData = useRestaurantData();
  const restaurants = restaurantData.restaurantsWithDirection;
  const latitude = restaurantData.latitude;
  const longitude = restaurantData.longitude;
  const radius = restaurantData.radius || 500;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [hoveredRestaurant, setHoveredRestaurant] =
    useState<null | RestaurantData>(null);
  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [previousPlaceId, setPreviousPlaceId] = useState<string | null>(null);

  const center = {
    lat: latitude ?? DEFAULT_CENTER.lat,
    lng: longitude ?? DEFAULT_CENTER.lng,
  };

  const [mapCenter, setMapCenter] = useState(center);

  const containerStyle = {
    width: "60vw",
    height: "80vh",
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
  };

  const handleDirectionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (result && status === google.maps.DirectionsStatus.OK) {
      if (!previousPlaceId || previousPlaceId !== selectedRestaurant?.placeId) {
        setDirectionsResult(result);
        setTravelTime(result.routes[0].legs[0].duration?.text || null);
        setPreviousPlaceId(selectedRestaurant?.placeId || null);
      }
    } else {
      setDirectionsResult(null);
      setTravelTime(null);
      setPreviousPlaceId(null);
      console.error("Failed to get directions:", status);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.restaurantInfo}>
        <div className={styles.restaurantList}>
          {restaurants?.map(
            (restaurant, index) =>
              restaurant.direction === "right" && (
                <RestaurantListItem
                  key={restaurant.placeId}
                  restaurant={restaurant}
                  setHoveredRestaurant={setHoveredRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                />
              )
          )}
        </div>
        {selectedRestaurant && (
          <RestaurantInfo
            restaurant={selectedRestaurant}
            setSelectedRestaurant={() => setSelectedRestaurant(null)}
            setDirectionsResult={() => setDirectionsResult(null)}
            setTravelTime={() => setTravelTime(null)}
            setPreviousPlaceId={() => setPreviousPlaceId(null)}
          />
        )}
      </div>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={getZoomSize(radius)}
        >
          <UserMarker center={center} radius={radius} travelTime={travelTime} />
          <RestaurantMarkers
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            hoveredRestaurant={hoveredRestaurant}
            setHoveredRestaurant={setHoveredRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
          />
          <SelectedMarker
            selectedRestaurant={selectedRestaurant}
            hoveredRestaurant={hoveredRestaurant}
            setHoveredRestaurant={setHoveredRestaurant}
          />
          <Directions
            center={center}
            selectedRestaurant={selectedRestaurant}
            directionsResult={directionsResult}
            handleDirectionsCallback={handleDirectionsCallback}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
export default MapPage;