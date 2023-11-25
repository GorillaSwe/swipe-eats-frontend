import { useState, useEffect } from "react";

const TOKYO_STATION_LAT = 35.681236;
const TOKYO_STATION_LNG = 139.767125;

const useLocation = () => {
  const [latitude, setLatitude] = useState<number>(TOKYO_STATION_LAT);
  const [longitude, setLongitude] = useState<number>(TOKYO_STATION_LNG);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentPosition = () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("位置情報の取得中にエラーが発生しました: ", error);
          setError(error.message);
        },
        options
      );
    };

    if (navigator.geolocation) {
      fetchCurrentPosition();
    } else {
      setError("位置情報の取得がサポートされていません。");
    }
  }, []);

  return { latitude, longitude, error };
};

export default useLocation;
