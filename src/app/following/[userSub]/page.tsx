"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { UserProfile } from "@auth0/nextjs-auth0/client";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import FilterButton from "@/components/ui/FilterButton/FilterButton";
import UserListItem from "@/features/search/components/UserListItem";
import { getFollowing } from "@/lib/api/followRelationshipsInfo";
import { getUserProfile } from "@/lib/api/usersInfo";
import styles from "@/styles/FollowPage.module.scss";
import { UserData } from "@/types/UserData";

const FollowingPage = ({ params }: { params: { userSub: string } }) => {
  const router = useRouter();
  const userSub = params.userSub;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfilePromise = getUserProfile(userSub);
        const followingPromise = getFollowing(userSub);
        const [userProfileResult, followingResult] = await Promise.all([
          userProfilePromise,
          followingPromise,
        ]);
        setUserProfile(userProfileResult);
        setFollowing(followingResult);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (userSub) {
      fetchData();
    }
  }, [userSub]);

  const handleFilterChange = (filterType: string) => {
    if (filterType === "followers") {
      router.push(`/followers/${userSub}`);
    }
  };

  if (!userProfile) {
    return <LoadingSection />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Link href={`/user/${userSub}`}>
          <ArrowBackIosNewIcon />
        </Link>
        <Image
          src={
            userProfile
              ? userProfile?.picture ?? "/images/header/guest.png"
              : ""
          }
          alt={userProfile ? userProfile?.name ?? "ゲスト" : ""}
          width={50}
          height={50}
          className={styles.image}
        />
        <p className={styles.name}>
          {userProfile ? userProfile?.name ?? "ゲスト" : " "}
        </p>
      </div>
      <div className={styles.buttons}>
        <FilterButton
          filterType="following"
          filterString="フォロー中"
          activeFilter="following"
          count={null}
          setFilter={handleFilterChange}
        />
        <FilterButton
          filterType="followers"
          filterString="フォロワー"
          activeFilter="following"
          count={null}
          setFilter={handleFilterChange}
        />
      </div>
      <div className={styles.userContainer}>
        {following.map((following, index) => (
          <UserListItem key={following.sub} user={following} />
        ))}
        {following.length === 0 && (
          <div className={styles.empty}>
            <span>フォロー中のユーザーが</span>
            <span>見つかりません。</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
