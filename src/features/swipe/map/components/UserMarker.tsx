import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { CircleF, MarkerF, InfoWindowF } from "@react-google-maps/api";

import styles from "./UserMarker.module.scss";

const USER_MARKER_ICON = "/images/map/user.png";

const CIRCLE_OPTIONS = {
  strokeColor: "#115EC3",
  strokeOpacity: 0.2,
  strokeWeight: 1,
  fillColor: "#115EC3",
  fillOpacity: 0.2,
};

interface UserMarkerProps {
  center: {
    lat: number;
    lng: number;
  };
  radius?: number;
  travelTime: string | null;
}

const UserMarker: React.FC<UserMarkerProps> = ({
  center,
  radius = 500,
  travelTime,
}) => {
  return (
    <>
      <CircleF center={center} radius={radius} options={CIRCLE_OPTIONS} />
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
