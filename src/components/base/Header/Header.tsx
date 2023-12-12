"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";

import useAccessToken from "@/lib/api/useAccessToken";
import { createUser } from "@/lib/api/usersInfo";

import styles from "./Header.module.scss";

const Header: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const token = useAccessToken();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isLoading && !error && user?.sub && token) {
      createUser(token, {
        sub: user.sub,
        name: user.name ?? "",
        picture: user.picture ?? "",
      });
    }
  }, [user, isLoading, error, token]);

  const renderUserContent = () => {
    if (isLoading) {
      return (
        <>
          <span className={styles.largeText}>Loading...</span>
          <span className={styles.smallText}>...</span>
        </>
      );
    }

    const userImage = user?.picture ?? "/images/header/guest.png";
    const userName = user?.name ?? "ゲスト";
    const authLink = user ? "/api/auth/logout" : "/api/auth/login";
    const authText = user ? "ログアウト" : "ログイン";

    return (
      <>
        <div className={styles.userInfoContainer}>
          <Image
            src={userImage}
            alt={`${userName}のプロフィール画像`}
            width={34}
            height={34}
            className={styles.image}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <span>{userName}</span>
        </div>
        <div className={styles.authContainer}>
          <a href={authLink} className={styles.authLink}>
            {authText}
          </a>
          <div className={styles.menuContainer}>
            {isMenuOpen && (
              <div className={styles.menu}>
                <a href={authLink}>{authText}</a>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderLink = (
    href: string,
    IconComponent: any,
    text: string | undefined
  ) => (
    <Link href={href} className={styles.link}>
      <IconComponent />
      <span>{text}</span>
    </Link>
  );

  return (
    <header className={styles.container}>
      <div className={styles.desktopContainer}>
        <div className={styles.linkContainer}>
          {renderLink("/home", HomeIcon, "ホーム")}
          {renderLink("/search", SearchIcon, "検索")}
          {renderLink("/", SwipeRightIcon, "スワイプ")}
          {renderLink("/profile", PersonIcon, "プロフィール")}
        </div>
        <div className={styles.userContainer}>{renderUserContent()}</div>
      </div>

      <div className={styles.mobileContainer}>
        {renderLink("/home", HomeIcon, undefined)}
        {renderLink("/search", SearchIcon, undefined)}
        {renderLink("/", SwipeRightIcon, undefined)}
        {renderLink("/profile", PersonIcon, undefined)}
        <div className={styles.mobileUserContainer}>{renderUserContent()}</div>
      </div>
    </header>
  );
};

export default Header;
