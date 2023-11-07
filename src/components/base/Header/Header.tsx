"use client";

import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";

import client from "@/lib/apiClient";

import styles from "./Header.module.scss";

const Header: React.FC = () => {
  const { user, error, isLoading } = useUser();

  interface User {
    sub: string;
    name: string;
    email: string;
    picture: string;
  }

  useEffect(() => {
    if (!isLoading && !error && user?.sub) {
      sendUserData({
        sub: user.sub,
        name: user.name ?? "",
        email: user.email ?? "",
        picture: user.picture ?? "",
      });
    }
  }, [user, isLoading, error]);

  const sendUserData = async (userData: User) => {
    try {
      await client.post("/users", userData);
    } catch (err) {
      console.error("バックエンドへのデータ送信エラー:", err);
    }
  };

  const renderUserContent = () => {
    if (isLoading) {
      return <div>読み込み中...</div>;
    }

    if (error) {
      return <div>エラー: {error.message}</div>;
    }

    if (user) {
      return (
        <>
          <div className={styles.userInfoContainer}>
            {user.picture && (
              <Image
                src={user.picture}
                alt={`${user.name}のプロフィール画像`}
                width={40}
                height={40}
                className={styles.image}
              />
            )}
            <span>{user.name}</span>
          </div>
          <a href="/api/auth/logout">ログアウト</a>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.userInfoContainer}>
            <span>ゲスト</span>
          </div>
          <a href="/api/auth/login">ログイン</a>
        </>
      );
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.linkContainer}>
        <Link href="/home" className={styles.link}>
          <HomeIcon />
          <span>ホーム</span>
        </Link>
        <Link href="/search" className={styles.link}>
          <SearchIcon />
          <span>検索</span>
        </Link>
        <Link href="/swipe" className={styles.link}>
          <SwipeRightIcon />
          <span>スワイプ</span>
        </Link>
        <Link href="/profile" className={styles.link}>
          <PersonIcon />
          <span>プロフィール</span>
        </Link>
      </div>
      <div className={styles.userContainer}>{renderUserContent()}</div>
    </header>
  );
};

export default Header;
