import React, { useState, useRef, useMemo, useEffect } from "react";
import { RestaurantData } from "@/types/RestaurantData";
import TinderCard from 'react-tinder-card'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './CardSwiper.module.css';
import CardImageSlider from '@/features/results/components/CardImageSlider'
import CardInfo from '@/features/results/components/CardInfo'
import CardButtons from '@/features/results/components/CardButtons'

interface CardSwiperProps {
  restaurants: RestaurantData[];
  onCardSwipe: (index: number, direction: string) => void;
  onLastCardSwipe: () => void;
}

const CardSwiper: React.FC<CardSwiperProps> = ({ restaurants, onCardSwipe, onLastCardSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(restaurants.length - 1)
  const sliderSettings = {
    dots: false,
    slidesToShow: 1,
    infinite: false,
    useCSS: false,
  };
  const currentIndexRef = useRef(currentIndex)

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
  )

  /**
   * state(currentIndex)を更新し連動している
   * useRef(currentIndexRef)も更新する
   */
  const updateCurrentIndex = async (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  /**
   * goback可能かを判定する
   * DBが5の場合3の時はgobackできない
   * 初手gobackを不可にするために設置している
   */
  const canGoBack = currentIndex < restaurants.length - 1

  /**
   * スワイプ可能かを判定する
   * DBが5の場合3,2,1,0,-1と減っていく
   */
  const canSwipe = currentIndex >= 0

  /**
   * ボタンを押下してスワイプした時に発火する
   * currentIndexを+1する
   */
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  /**
   * ボタンを押下してスワイプした時に発火する
   * ライブラリのonSwipeメソッドを叩く=ローカルのswipeメソッドを叩く
   */
  const swipe = async (direction: string) => {
    if (canSwipe && currentIndex < restaurants.length) {
      await childRefs[currentIndex].current.swipe(direction)
    }
  }

  /**
   * 1,手動でのスワイプした時に発火する
   * 2,ボタンを押下してスワイプした時に発火する（条件2の時swipe関数も発火する）
   * currentIndexを-1減らす
   */
  const swiped = (direction: string, nameToDelete: string, index: number) => {
    updateCurrentIndex(index - 1)
    onCardSwipe(index, direction);
    if (currentIndex === 0) onLastCardSwipe()
  }

  /**
   * 1,手動でのスワイプした時に発火する
   * 2,ボタンを押下してスワイプした時に発火する（条件2の時swipe関数も発火する）
   */
  const outOfFrame = (name: string, index: number) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard()
  }

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
            onSwipe={(dir) => swiped(dir, restaurant.name, index)}
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
      />
    </div>
  );
};

export default CardSwiper;
