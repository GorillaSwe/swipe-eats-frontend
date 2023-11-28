import React from "react";

import Image from "next/image"; // Image コンポーネントのインポート

import { RestaurantData } from "@/types/RestaurantData";

type TimelineProps = {
  favorites: RestaurantData[];
};

const Timeline: React.FC<TimelineProps> = ({ favorites }) => {
  return (
    <div>
      {favorites.map((favorite, index) => (
        <div key={index} className="timeline-item">
          <div className="restaurant-info">
            <h2>{favorite.name}</h2>
          </div>
          {favorite.photos && (
            <div className="restaurant-image">
              <Image
                src={favorite.photos[0]}
                alt={favorite.name}
                width={500}
                height={300}
                layout="responsive"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
