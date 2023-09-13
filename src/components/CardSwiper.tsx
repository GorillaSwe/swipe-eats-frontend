import React, { useState } from "react";
import Card from "./Card"; // Cardコンポーネントをインポート
import { CardData } from "../types/CardData"; // CardData.ts ファイルから型情報をインポート
  
interface CardSwiperProps {
    cardData: CardData[];
}

const CardSwiper: React.FC<CardSwiperProps> = ({ cardData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: string) => {
    // スワイプの処理をここに実装
    // 例: インデックスを更新して次のカードを表示
    if (direction === "right") {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "left") {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="card-swiper">
      {cardData.map((data, index) => (
        <Card key={index} data={data} onSwipe={handleSwipe} />
      ))}
    </div>
  );
};

export default CardSwiper;
