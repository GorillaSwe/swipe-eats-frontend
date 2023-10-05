"use client";

import React, { useState } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useRestaurantData } from '@/contexts/RestaurantContext';
import { RestaurantData } from "@/types/RestaurantData";
import styles from './page.module.css';

const DEFAULT_CENTER = {
  lat: 35.5649221,
  lng: 139.6559956,
};

const USER_MARKER_ICON = "https://maps.google.com/mapfiles/ms/micons/man.png";
const LIKE_MARKER_ICON = "https://maps.google.com/mapfiles/ms/micons/red-dot.png";
const NOPE_MARKER_ICON = "https://labs.google.com/ridefinder/images/mm_20_gray.png";
const OTHER_MARKER_ICON = "https://labs.google.com/ridefinder/images/mm_20_black.png";

const MapPage: React.FC = () => {
  const restaurantData = useRestaurantData();
  const restaurants = restaurantData.restaurantsWithDirection
  const latitude = restaurantData.latitude
  const longitude = restaurantData.longitude
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | RestaurantData>(null);

  const center = {
    lat: latitude ?? DEFAULT_CENTER.lat,
    lng: longitude ?? DEFAULT_CENTER.lng
    // lat: DEFAULT_CENTER.lat,
    // lng: DEFAULT_CENTER.lng
  };

  const [currentCenter, setCurrentCenter] = useState(center);

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
  
  return (
    <div className={styles.container}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={17}
      >
        <MarkerF 
          icon={USER_MARKER_ICON}
          position={center}
        />
        {restaurants?.map((restaurant, index) => (
          <MarkerF
            key={index}
            position={{ 
              lat: restaurant.lat,
              lng: restaurant.lng,
            }}
            icon={getMarkerIcon(restaurant.direction)}
            onClick={() => {
              setSelectedRestaurant(restaurant)
              setCurrentCenter({ lat: restaurant.lat, lng: restaurant.lng });
            }}
          />
        ))}
      </GoogleMap>
      {selectedRestaurant && (
        <div className={styles.info}>
          <h2 className={styles.name}>{selectedRestaurant.name}</h2>
          <div
            style={{ backgroundImage: `url(${selectedRestaurant.photos[0]})` }}
            className={styles.image}
          >
          </div>
        </div>
      )}
    </LoadScript>
    </div>
  );
};
export default MapPage;
