"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

const AuthNavbar: React.FC = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  console.log(user);
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

export default AuthNavbar;
