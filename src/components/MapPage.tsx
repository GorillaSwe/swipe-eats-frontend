import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'

const MapPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { restaurantsWithDirection: any[] };
  const restaurantsWithDirection = state.restaurantsWithDirection;
  const key = process.env.REACT_APP_GOOGLE_API_KEY || '';

  // Google Mapを描画するサイズ
  const containerStyle = {
    width: '90vw',
    height: '58vh',
  }
  // マップの中央（Google Mapでポイントすれば出てくる）
  const center = {
    lat: 35.5634291,
    lng: 139.6536136,
  }
  // オーバーレイする画像の右上と左下の点
  const bounds = {
    north: 40.52,
    south: 40.4942,
    east: 141.513105,
    west: 141.4666
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <LoadScript googleMapsApiKey={key}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
      >
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
