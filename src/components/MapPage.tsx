import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'

const DEFAULT_CENTER = {
  lat: 35.5634291,
  lng: 139.6536136,
};

const USER_MARKER_ICON = "https://maps.google.com/mapfiles/kml/paddle/blu-stars.png";

const MapPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { 
    restaurantsWithDirection: any[],
    latitude: number | null,
    longitude: number | null
  };
  const { restaurantsWithDirection, latitude, longitude } = state;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';

  const containerStyle = {
    width: '90vw',
    height: '75vh',
  }

  const center = {
    lat: latitude ?? DEFAULT_CENTER.lat,
    lng: longitude ?? DEFAULT_CENTER.lng
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
      >
        <MarkerF 
          icon={USER_MARKER_ICON}
          position={center}
        />
        {restaurantsWithDirection.map((restaurant, index) => (
          <MarkerF
            key={index}
            position={{ 
              lat: restaurant.lat,
              lng: restaurant.lng,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
    </div>
  );
};
export default MapPage;
