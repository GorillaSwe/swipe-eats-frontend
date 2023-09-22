import React, { useState } from "react";

interface LocationSelectorProps {
  onLocationChange: (latitude: number, longitude: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const DEFAULT_LATITUDE = 35.681318174002534;
  const DEFAULT_LONGITUDE = 139.76713519281384;


  const handleLocationChange = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          onLocationChange(position.coords.latitude, position.coords.longitude);
        },
        function (error) {
          console.error("現在地の取得に失敗しました:", error);
          // デフォルトの値を設定するなどの処理を追加
          setLatitude(DEFAULT_LATITUDE); // 例: デフォルトの緯度を設定
          setLongitude(DEFAULT_LONGITUDE); // 例: デフォルトの経度を設定
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
