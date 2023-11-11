import { useState, useEffect } from "react";

const useLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentPosition = async () => {
      try {
        const position = await getCurrentPosition();
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      } catch (error) {
        console.error("位置情報の取得に失敗しました:", error);
      }
    };
    fetchCurrentPosition();
  }, []);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return { latitude, longitude };
};

export default useLocation;
