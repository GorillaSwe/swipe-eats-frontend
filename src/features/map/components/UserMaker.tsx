import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { CircleF, MarkerF, InfoWindowF } from "@react-google-maps/api";

import styles from "./UserMarker.module.scss";

const USER_MARKER_ICON = "/images/map/user.png";

interface UserMarkerProps {
  center: {
    lat: number;
    lng: number;
  };
  radius: number | 500;
  travelTime: string | null;
}

const UserMarker: React.FC<UserMarkerProps> = ({
  center,
  radius,
  travelTime,
}) => {
  return (
    <>
      <CircleF
        center={center}
        radius={radius}
        options={{
          strokeColor: "#115EC3",
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: "#115EC3",
          fillOpacity: 0.2,
        }}
      />
      <MarkerF position={center} icon={USER_MARKER_ICON}>
        {travelTime && (
          <InfoWindowF position={center}>
            <div className={styles.infoWindow}>
              <DirectionsWalkIcon />
              {travelTime}
            </div>
          </InfoWindowF>
        )}
      </MarkerF>
    </>
  );
};

export default UserMarker;
