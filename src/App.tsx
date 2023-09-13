import React, { useEffect, useState } from "react"
import { showRestaurants } from "utils/api/restaurants"
import CardSwiper from "./components/CardSwiper"; // CardSwiperコンポーネントをインポート

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
      {/* CardSwiperコンポーネントにレストランデータを渡す */}
      <CardSwiper cardData={restaurants} />
    </div>
  );
};

export default App;