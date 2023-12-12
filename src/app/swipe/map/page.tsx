"use client";

import { useEffect, useRef, useState } from "react";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { NextPage } from "next";

import ErrorSection from "@/components/base/Error/ErrorSection";
import RestaurantListItem from "@/components/base/RestaurantListItem/RestaurantListItem";
import { useRestaurantData } from "@/contexts/RestaurantContext";
import ButtonContainer from "@/features/swipe/map/components/ButtonContainer";
import Directions from "@/features/swipe/map/components/Directions";
import RestaurantInfo from "@/features/swipe/map/components/RestaurantInfo";
import RestaurantMarkers from "@/features/swipe/map/components/RestaurantMarkers";
import SelectedMarker from "@/features/swipe/map/components/SelectedMarker";
import UserMarker from "@/features/swipe/map/components/UserMarker";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const DEFAULT_CENTER = { lat: 35.5649221, lng: 139.6559956 };

type ZoomLevels = {
  [key: number]: number;
  default: number;
};

const ZOOM_LEVELS: ZoomLevels = {
  100: 17,
  300: 17,
  500: 16,
  1000: 15,
  2000: 14,
  default: 16,
};

const MapPage: NextPage = () => {
  const restaurantData = useRestaurantData();
  const latitude = restaurantData.latitude;
  const longitude = restaurantData.longitude;
  const radius = restaurantData.radius || 500;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const [restaurants, setRestaurants] = useState<RestaurantData[]>(
    restaurantData.restaurants
  );
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [hoveredRestaurant, setHoveredRestaurant] =
    useState<null | RestaurantData>(null);
  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [previousPlaceId, setPreviousPlaceId] = useState<string | null>(null);
  const [filter, setFilter] = useState("favorites");
  const [isHeightOver, setIsHeightOver] = useState(false);
  const [zIndex, setZIndex] = useState(3);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const favoriteCount = restaurants.filter((r) => r.isFavorite === true).length;
  const nullCount = restaurants.filter((r) => r.isFavorite === null).length;
  const allCount = restaurants.filter((r) => r.isFavorite !== false).length;

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: latitude ?? DEFAULT_CENTER.lat,
    lng: longitude ?? DEFAULT_CENTER.lng,
  };

  const getZoomSize = (radius: number) => {
    return ZOOM_LEVELS[radius] || ZOOM_LEVELS.default;
  };

  const visibleRestaurants = restaurants.filter((restaurant) => {
    switch (filter) {
      case "favorites":
        return restaurant.isFavorite === true;
      case "null":
        return restaurant.isFavorite === null;
      case "all":
        return restaurant.isFavorite !== false;
      default:
        return true;
    }
  });

  const visibleRestaurantsLength = restaurants.filter(
    (restaurant) => restaurant.isFavorite !== false
  ).length;

  const clearSelectedRestaurant = () => {
    setSelectedRestaurant(null);
    setHoveredRestaurant(null);
    setDirectionsResult(null);
    setTravelTime(null);
    setPreviousPlaceId(null);
  };

  useEffect(() => {
    if (selectedRestaurant) {
      const updatedSelectedRestaurant = restaurants.find(
        (r) => r.placeId === selectedRestaurant.placeId
      );
      if (updatedSelectedRestaurant) {
        setSelectedRestaurant(updatedSelectedRestaurant);
      }
    }
  }, [restaurants, selectedRestaurant]);

  const restaurantInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restaurantInfo = restaurantInfoRef.current;
    if (!restaurantInfo) return;

    const scrollAction = () => {
      const currentScrollTop = restaurantInfo.scrollTop;
      const halfWindowHeight = (window.innerHeight - 70) / 2;
      if (isHeightOver) {
        if (currentScrollTop === 0) {
          setIsHeightOver(false);
          setTimeout(() => setZIndex(2), 500);
        }
      } else {
        if (currentScrollTop < halfWindowHeight) {
          setIsHeightOver(true);
          setZIndex(4);
        }
      }
    };
    restaurantInfo.addEventListener("scroll", scrollAction);
    return () => {
      restaurantInfo.removeEventListener("scroll", scrollAction);
    };
  }, [isHeightOver]);

  useEffect(() => {
    setZIndex(isDialogOpen || isHeightOver ? 4 : 2);
  }, [isDialogOpen]);

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
    }
  };

  if (visibleRestaurantsLength <= 0) {
    return (
      <ErrorSection error={"表示するレストランがありません"} category={null} />
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.restaurantInfo}
        style={{ zIndex: zIndex }}
        ref={restaurantInfoRef}
      >
        <div
          className={`${styles.hiddenContainer} ${
            isHeightOver
              ? styles.scrollHiddenContainerZero
              : styles.scrollHiddenContainerFifty
          }`}
        ></div>

        {!selectedRestaurant && (
          <>
            <ButtonContainer
              filter={filter}
              setFilter={setFilter}
              favoriteCount={favoriteCount}
              nullCount={nullCount}
              allCount={allCount}
            />
            <div className={styles.restaurantList}>
              {visibleRestaurants?.map((restaurant, index) => (
                <RestaurantListItem
                  key={restaurant.placeId}
                  restaurant={restaurant}
                  setHoveredRestaurant={setHoveredRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                />
              ))}
            </div>
          </>
        )}
        {selectedRestaurant && (
          <RestaurantInfo
            restaurant={selectedRestaurant}
            setRestaurants={setRestaurants}
            clearSelectedRestaurant={clearSelectedRestaurant}
            onDialogStateChange={setIsDialogOpen}
          />
        )}
      </div>
      <div className={styles.mapContainer}>
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={getZoomSize(radius)}
          >
            <UserMarker
              center={center}
              radius={radius}
              travelTime={travelTime}
            />
            <RestaurantMarkers
              restaurants={visibleRestaurants}
              selectedRestaurant={selectedRestaurant}
              hoveredRestaurant={hoveredRestaurant}
              setHoveredRestaurant={setHoveredRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
            />
            <SelectedMarker selectedRestaurant={selectedRestaurant} />
            <Directions
              center={center}
              selectedRestaurant={selectedRestaurant}
              directionsResult={directionsResult}
              handleDirectionsCallback={handleDirectionsCallback}
            />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};
export default MapPage;
