import React, { useState } from "react";
import { CardData } from "../types/CardData"; // CardData.ts ファイルから型情報をインポート

interface CardProps {
    data: CardData;
    onSwipe: (direction: string) => void;
}

const Card: React.FC<CardProps> = ({ data, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const handleTouchStart = (e: React.TouchEvent) => {
    // タッチが開始されたときの処理
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // カードがドラッグ中の処理
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // カードをドラッグした距離に基づいてカードを移動またはアニメーション
    // ここでは簡単な移動アニメーションを考えています
    // カードが右にスワイプされたか、左にスワイプされたかを判定できるロジックを実装
  };

  const handleTouchEnd = () => {
    // タッチが終了したときの処理
    setIsDragging(false);

    // カードがどの方向にスワイプされたかを判定して、onSwipeコールバックを呼び出す
    // 例: onSwipe("right") または onSwipe("left")
  };

  return (
    <div
      className={`card ${isDragging ? "dragging" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* カードのコンテンツを表示 */}
      {/* 例: data.nameやdata.imageを表示 */}
      <h2>{data.name}</h2>
      <img
        src={data.photoUrl}
        alt={data.name}
      />
    </div>
  );
};

export default Card;
