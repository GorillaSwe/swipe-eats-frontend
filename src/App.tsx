import React, { useEffect, useState } from "react"

import { showRestaurants } from "lib/api/restaurants"

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const handleShowRestaurants = async () => {
    try {
      const res = await showRestaurants();
      if (res && res.status === 200) {
        // レストランのデータを取得
        const restaurantData = res.data.message;
        setRestaurants(restaurantData);
      }
    } catch (error) {
      console.error("レストランデータの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    handleShowRestaurants();
  }, []);

  return (
    <div>
      <h1>レストラン一覧</h1>
      <ul>
        {restaurants.map((restaurant: any, index) => (
          <li key={index}>
            <h2>{restaurant.name}</h2>
            <p>住所: {restaurant.vicinity}</p>
            {/* 他のレストラン情報も表示できるように修正 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;