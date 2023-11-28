"use client";

import { useState, useEffect, useCallback } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import InfiniteScroll from "react-infinite-scroller";

import LoadingScreen from "@/components/base/Loading/LoadingScreen";
import Timeline from "@/features/home/components/Timeline";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

const HomePage: NextPage = () => {
  const [favorites, setFavorites] = useState<RestaurantData[]>([]);
  const { user, isLoading } = useUser();
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const [hasMore, setHasMore] = useState(true); // もっとデータがあるかどうか

  const fetchLatestFavorites = async (page: number) => {
    try {
      const response = await client.get("/favorites/latest", {
        params: { page },
      });
      // 現在のお気に入りに新しいデータを結合
      setFavorites((prev) => [...prev, ...response.data.favorites]);
      setHasMore(response.data.favorites.length > 0); // データが空ならもうデータがない
    } catch (error) {
      console.error("お気に入りの取得に失敗しました。", error);
      setHasMore(false); // エラーが発生した場合、データの取得を停止
    }
    setLoadingFavorites(false);
  };

  // スクロールイベントのハンドラ
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      !hasMore
    ) {
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  }, [hasMore]);

  useEffect(() => {
    // スクロールイベントリスナーの登録
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchLatestFavorites(currentPage);
  }, [currentPage]);

  if (isLoading || loadingFavorites) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <h1>タイムライン</h1>
      <InfiniteScroll
        loadMore={fetchLatestFavorites}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        <Timeline favorites={favorites} />
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
