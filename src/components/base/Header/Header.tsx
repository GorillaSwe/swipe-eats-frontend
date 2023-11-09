"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";

import client from "@/lib/apiClient";

import styles from "./Header.module.scss";

interface User {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

const Header: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const guestImage = "/images/header/guest.png";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isLoading && !error && user?.sub) {
      sendUserData({
        sub: user.sub,
        name: user.name ?? "",
        email: user.email ?? "",
        picture: user.picture ?? guestImage,
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

  const renderFeedbackText = (isLoading: boolean, error?: Error) => (
    <div>
      {isLoading ? (
        <>
          <span className={styles.largeText}>Loading...</span>
          <span className={styles.middleText}>...</span>
          <span className={styles.smallText}>...</span>
        </>
      ) : (
        <>
          <span className={styles.largeText}>Error: {error?.message}</span>
          <span className={styles.middleText}>Err</span>
          <span className={styles.smallText}></span>;
        </>
      )}
    </div>
  );

  const renderUserImage = (
    picture: string,
    name: string,
    imageSize: number,
    isMobile: boolean
  ) => (
    <Image
      src={picture}
      alt={`${name}のプロフィール画像`}
      width={imageSize}
      height={imageSize}
      className={styles.image}
      onClick={isMobile ? toggleMenu : undefined}
    />
  );

  const renderUserContent = (isMobile: boolean = false) => {
    if (isLoading || error) {
      return renderFeedbackText(isLoading, error);
    }

    const imageSize = isMobile ? 34 : 40;
    const userImage = user?.picture ?? guestImage;
    const userName = user?.name ?? "ゲスト";
    const authLink = user ? "/api/auth/logout" : "/api/auth/login";
    const authText = user ? "ログアウト" : "ログイン";

    return (
      <>
        <div className={styles.userInfoContainer}>
          {renderUserImage(userImage, userName, imageSize, isMobile)}
          {!isMobile && <span>{userName}</span>}
        </div>
        {!isMobile ? (
          <div className={styles.authContainer}>
            <a href={authLink} className={styles.authLink}>
              {authText}
            </a>
            <div className={styles.hamburger}>
              <MenuIcon className={styles.hamburgerIcon} onClick={toggleMenu} />
              <div
                className={styles.menu}
                style={{ display: isMenuOpen ? "block" : "none" }}
              >
                <a href={authLink}>{authText}</a>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={styles.menu}
            style={{ display: isMenuOpen ? "block" : "none" }}
          >
            <a href={authLink}>{authText}</a>
          </div>
        )}
      </>
    );
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
        <Link href="/" className={styles.link}>
          <SwipeRightIcon />
          <span>スワイプ</span>
        </Link>
        <Link href="/profile" className={styles.link}>
          <PersonIcon />
          <span>プロフィール</span>
        </Link>
      </div>
      <div className={styles.userContainer}>{renderUserContent()}</div>

      <div className={styles.mobileContainer}>
        <Link href="/home" className={styles.link}>
          <HomeIcon />
        </Link>
        <Link href="/search" className={styles.link}>
          <SearchIcon />
        </Link>
        <Link href="/" className={styles.link}>
          <SwipeRightIcon />
        </Link>
        <Link href="/profile" className={styles.link}>
          <PersonIcon />
        </Link>
        <div className={styles.mobileUserContainer}>
          {renderUserContent(true)}
        </div>
      </div>
    </header>
  );
};

export default Header;
