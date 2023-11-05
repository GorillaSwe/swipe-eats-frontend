"use client";

import React, { useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

import client from "@/lib/apiClient";

const Header: React.FC = () => {
  const { user, error, isLoading } = useUser();

  interface User {
    sub: string;
    name: string;
    email: string;
    picture: string;
  }

  useEffect(() => {
    const sendUserData = async (user: User | null | undefined) => {
      if (!user) return;
      try {
        const response = await client.post("/users", {
          uid: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture,
        });
      } catch (err) {
        console.error("バックエンドへのデータ送信エラー:", err);
      }
    };

    if (user?.sub) {
      sendUserData({
        sub: user.sub,
        name: user.name ?? "",
        email: user.email ?? "",
        picture: user.picture ?? "",
      });
    }
  }, [user]);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user ? (
        <>
          <p>{user.name}</p>
          <a href="/api/auth/logout">ログアウト</a>
        </>
      ) : (
        <>
          <p>ゲストとして閲覧中です。</p>
          <a href="/api/auth/login">ログイン</a>
        </>
      )}
    </div>
  );
};

export default Header;
