import React from "react";
import styles from './DistanceSlider.module.css';

type DistanceSliderProps = {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
};

const valMap = [100, 500, 1000, 2000, 3000, 4000, 5000];

const DistanceSlider: React.FC<DistanceSliderProps> = ({ selectedRadius, onRadiusChange }) => {
  const handleSliderChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = event.target as HTMLDivElement;
    const totalWidth = slider.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const percentage = (offsetX / totalWidth) * 100;
    const index = Math.round((percentage * (valMap.length - 1)) / 100);
    onRadiusChange(valMap[index]);
  };

  const getRadiusLabel = (radius: number): string => {
    return radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>最長距離</h3>
      <div className={styles.slider} onClick={handleSliderChange}>
        {valMap.map((value, index) => (
          <label
            key={index}
            style={{ left: `${(index / (valMap.length - 1)) * 100}%` }}
            className={styles.label}
          >
            {getRadiusLabel(value)}
          </label>
        ))}
        <div
          className={styles.handle}
          style={{ left: `${(valMap.indexOf(selectedRadius) / (valMap.length - 1)) * 100}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default DistanceSlider;