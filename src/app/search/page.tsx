"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import RestaurantInfo from "@/components/base/RestaurantInfo/RestaurantInfo";
import ButtonContainer from "@/features/search/components/ButtonContainer";
import RestaurantListItem from "@/features/search/components/RestaurantListItem";
import SearchBar from "@/features/search/components/SearchBar";
import UserListItem from "@/features/search/components/UserListItem";
import useLocation from "@/features/swipe/search/hooks/useLocation";
import { searchRestaurants } from "@/lib/api/restaurantsInfo";
import useAccessToken from "@/lib/api/useAccessToken";
import { searchUsers } from "@/lib/api/usersInfo";
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
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (filter === "restaurants") {
      const fetchedRestaurants = await searchRestaurants(
        token,
        query,
        latitude,
        longitude,
        user
      );
      setRestaurants(fetchedRestaurants);
    } else if (filter === "users") {
      const fetchedUsers = await searchUsers(query);
      setUsers(fetchedUsers);
    }
  };

  const removeFavorite = (placeId: string) => {};

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

      {filter === "restaurants" ? (
        <div className={styles.restaurantContainer}>
          {restaurants.map((restaurant, index) => (
            <RestaurantListItem
              key={restaurant.placeId}
              restaurant={restaurant}
              setSelectedRestaurant={setSelectedRestaurant}
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
        </div>
      ) : (
        <div className={styles.userContainer}>
          {users.map((user, index) => (
            <UserListItem key={user.sub} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
