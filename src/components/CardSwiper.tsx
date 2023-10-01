import React, { useState, useRef, useMemo, useEffect } from "react";
import { CardData } from "../types/CardData";
import TinderCard from 'react-tinder-card'
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import UndoIcon from "@mui/icons-material/Undo";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CardSwiperProps {
    cardData: CardData[];
    onCardSwipe: (index: number, direction: string) => void;
    onLastCardSwipe: () => void;
}

const CardSwiper: React.FC<CardSwiperProps> = ({ cardData, onCardSwipe, onLastCardSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(cardData.length - 1)
  const sliderSettings = {
    dots: false,
    slidesToShow: 1,
    infinite: false,
    useCSS: false,
  };
  const currentIndexRef = useRef(currentIndex)

  /**
   * dbのlengthだけRefを生成する
   * TinderSwipeを通すことでswipeメソッドとrestoreCardメソッドを付与する(useImperativeHandle)
   */
  const childRefs = useMemo<any>(
    () =>
      Array(cardData.length)
        .fill(0)
        .map((i) => React.createRef()),
    [cardData.length]
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
  const canGoBack = currentIndex < cardData.length - 1

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
    if (canSwipe && currentIndex < cardData.length) {
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
    if(currentIndex === 0) onLastCardSwipe()
  }

  /**
   * 1,手動でのスワイプした時に発火する
   * 2,ボタンを押下してスワイプした時に発火する（条件2の時swipe関数も発火する）
   */
  const outOfFrame = (name: string, index: number) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard()
  }
  
  // cardData.lengthが変更された際にcurrentIndexを更新する
  useEffect(() => {
    setCurrentIndex(cardData.length - 1);
  }, [cardData.length]);

  return (
    <div>
      <div className='cardContainer'>
        {cardData.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <Slider className= "SliderSection" {...sliderSettings}>
              {character.photoUrl ? (
                character.photoUrl.map((photo, photoIndex) => (
                  <div
                    key={photoIndex}
                  >
                    <div
                      style={{ backgroundImage: 'url(' + photo.url + ')' }}
                      className='card'
                      key={photoIndex}
                    >
                      <h3>{character.name}</h3>
                    </div>
                  </div>)
                )
              ) : (
                <p>No photos available</p>
              )}
            </Slider>
          </TinderCard>
        ))}
      </div>
      <div className='buttons'>
        <IconButton style={{ backgroundColor: canSwipe ? '#9198e5' : '#c3c4d3' }} onClick={() => swipe('left')}>
          <CloseIcon fontSize="large" />
        </IconButton>
        <IconButton style={{ backgroundColor: canGoBack ? '#9198e5' : '#c3c4d3'}} onClick={() => goBack()}>
          <UndoIcon fontSize="large" />
        </IconButton>
        <IconButton style={{ backgroundColor: canSwipe ? '#9198e5' : '#c3c4d3' }} onClick={() => swipe('right')}>
          <FavoriteIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

export default CardSwiper;
