import React, { useState, useRef, useMemo, useEffect } from "react";

import CardButtons from "@/features/swipe/result/components/CardButtons";
import CardImageSlider from "@/features/swipe/result/components/CardImageSlider";
import CardInfo from "@/features/swipe/result/components/CardInfo";
import TinderCard from "@/lib/TinderCard/index.js";
import { RestaurantData } from "@/types/RestaurantData";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./CardSwiper.module.scss";

interface CardSwiperProps {
  restaurants: RestaurantData[];
  onCardSwipe: (index: number, direction: string) => void;
  onLastCardSwipe: () => void;
  onCardRestore: (index: number) => void;
}

const CardSwiper: React.FC<CardSwiperProps> = ({
  restaurants,
  onCardSwipe,
  onLastCardSwipe,
  onCardRestore,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(
    restaurants.length - 1
  );
  const currentIndexRef = useRef(currentIndex);

  /**
   * restaurantsのlengthだけRefを生成する
   * TinderSwipeを通すことでswipeメソッドとrestoreCardメソッドを付与する(useImperativeHandle)
   */
  const childRefs = useMemo<any>(
    () =>
      Array(restaurants.length)
        .fill(0)
        .map((i) => React.createRef()),
    [restaurants.length]
  );

  /**
   * state(currentIndex)を更新し連動している
   * useRef(currentIndexRef)も更新する
   */
  const updateCurrentIndex = async (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  /**
   * goback可能かを判定する
   * DBが5の場合3の時はgobackできない
   * 初手gobackを不可にするために設置している
   */
  const canGoBack = currentIndex < restaurants.length - 1;

  /**
   * スワイプ可能かを判定する
   * DBが5の場合3,2,1,0,-1と減っていく
   */
  const canSwipe = currentIndex >= 0;

  /**
   * ボタンを押下してスワイプした時に発火する
   * currentIndexを+1する
   */
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    onCardRestore(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  /**
   * ボタンを押下してスワイプした時に発火する
   * ライブラリのonSwipeメソッドを叩く=ローカルのswipeメソッドを叩く
   */
  const swipe = async (direction: string) => {
    if (canSwipe && currentIndex < restaurants.length) {
      await childRefs[currentIndex].current.swipe(direction);
    }
  };

  /**
   * 1,手動でのスワイプした時に発火する
   * 2,ボタンを押下してスワイプした時に発火する（条件2の時swipe関数も発火する）
   * currentIndexを-1減らす
   */
  const swiped = (direction: string, nameToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);
    onCardSwipe(index, direction);
  };

  /**
   * 1,手動でのスワイプした時に発火する
   * 2,ボタンを押下してスワイプした時に発火する（条件2の時swipe関数も発火する）
   */
  const outOfFrame = (name: string, index: number) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard();
  };

  // restaurants.lengthが変更された際にcurrentIndexを更新する
  useEffect(() => {
    setCurrentIndex(restaurants.length - 1);
  }, [restaurants.length]);

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {restaurants.map((restaurant, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={styles.card}
            key={restaurant.name}
            preventSwipe={["up", "down"]}
            onSwipe={(dir: string) => swiped(dir, restaurant.name, index)}
            onCardLeftScreen={() => outOfFrame(restaurant.name, index)}
          >
            <CardImageSlider photos={restaurant.photos} />
            <CardInfo restaurant={restaurant} />
          </TinderCard>
        ))}
      </div>
      <CardButtons
        canSwipe={canSwipe}
        canGoBack={canGoBack}
        swipe={swipe}
        goBack={goBack}
        onLastCardSwipe={onLastCardSwipe}
      />
    </div>
  );
};

export default CardSwiper;
