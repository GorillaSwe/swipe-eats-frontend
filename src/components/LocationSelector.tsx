import React, { useState } from "react";

interface LocationSelectorProps {
  onLocationChange: (latitude: number, longitude: number) => void;
}

const DEFAULT_LATITUDE = 35.681318174002534;
const DEFAULT_LONGITUDE = 139.76713519281384;

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {

  const handleLocationChange = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          onLocationChange(latitude, longitude);
        },
        (error) => {
          console.error("現在地の取得に失敗しました:", error);
          // エラー時にデフォルトの位置を使用する
          onLocationChange(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        }
      );
    }
  };

  return (
    <div>
      <button onClick={handleLocationChange}>現在地を取得</button>
    </div>
  );
};

export default LocationSelector;
