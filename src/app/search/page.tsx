"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import PartialLoadingSection from "@/components/base/Loading/PartialLoadingSection";
import RestaurantInfo from "@/components/base/RestaurantInfo/RestaurantInfo";
import RestaurantListItem from "@/components/base/RestaurantListItem/RestaurantListItem";
import ButtonContainer from "@/features/search/components/ButtonContainer";
import SearchBar from "@/features/search/components/SearchBar";
import UserListItem from "@/features/search/components/UserListItem";
import { searchRestaurants } from "@/lib/api/restaurantsInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { searchUsers } from "@/lib/api/usersInfo";
import useLocation from "@/lib/useLocation";
import { RestaurantData } from "@/types/RestaurantData";
import { UserData } from "@/types/UserData";

import styles from "./page.module.scss";

const SearchPage: NextPage<{}> = () => {
  const { user } = useUser();
  const { latitude, longitude } = useLocation();
  const token = useAccessToken();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("restaurants");
  const [users, setUsers] = useState<UserData[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRestaurantsEmptyResult, setIsRestaurantsEmptyResult] =
    useState(false);
  const [isUsersEmptyResult, setIsUsersEmptyResult] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    setIsSearching(true);
    if (filter === "restaurants") {
      const fetchedRestaurants = await searchRestaurants(
        token,
        query,
        latitude,
        longitude,
        user
      );
      setRestaurants(fetchedRestaurants);
      setIsRestaurantsEmptyResult(fetchedRestaurants.length === 0);
    } else if (filter === "users") {
      const fetchedUsers = await searchUsers(query);
      setUsers(fetchedUsers);
      setIsUsersEmptyResult(fetchedUsers.length === 0);
    }
    setIsSearching(false);
  };

  const removeFavorite = () => {};
  const setHoveredRestaurant = () => {};

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <div className={styles.container}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />
      <ButtonContainer filter={filter} setFilter={setFilter} />

      {filter === "restaurants" && (
        <div className={styles.restaurantContainer}>
          {isSearching ? (
            <PartialLoadingSection />
          ) : (
            <>
              {restaurants.map((restaurant, index) => (
                <RestaurantListItem
                  key={restaurant.placeId}
                  restaurant={restaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                  setHoveredRestaurant={setHoveredRestaurant}
                />
              ))}
              {selectedRestaurant && (
                <RestaurantInfo
                  restaurant={selectedRestaurant}
                  setRestaurants={setRestaurants}
                  setSelectedRestaurant={() => setSelectedRestaurant(null)}
                  removeFavorite={removeFavorite}
                  displayFavorite={true}
                />
              )}
              {isRestaurantsEmptyResult && (
                <div className={styles.empty}>
                  <span>レストランの検索結果が</span>
                  <span>ありません。</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {filter === "users" && (
        <div className={styles.userContainer}>
          {isSearching ? (
            <PartialLoadingSection />
          ) : (
            <>
              {users.map((user, index) => (
                <UserListItem key={user.sub} user={user} />
              ))}
              {isUsersEmptyResult && (
                <div className={styles.empty}>
                  <span>ユーザーの検索結果が</span>
                  <span>ありません。</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
