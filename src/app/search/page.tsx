"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { NextPage } from "next";

import LoadingSection from "@/components/base/Loading/LoadingSection";
import RestaurantInfo from "@/features/search/components/RestaurantInfo";
import RestaurantListItem from "@/features/search/components/RestaurantListItem";
import UserListItem from "@/features/search/components/UserListItem";
import useLocation from "@/features/swipe/search/hooks/useLocation";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";
import { UserData } from "@/types/UserData";

import styles from "./page.module.scss";

const SearchPage: NextPage<{}> = () => {
  const { user } = useUser();

  const { latitude, longitude } = useLocation();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);
  const [users, setUsers] = useState<UserData[]>([]);

  const clearInput = () => {
    setQuery("");
  };
  const [filter, setFilter] = useState("restaurants");

  useEffect(() => {
    if (latitude && longitude) {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (filter === "restaurants") {
      if (user) {
        try {
          const tokenResponse = await fetch("/api/token");
          const tokenData = await tokenResponse.json();
          const token = tokenData.accessToken;

          const response = await client.get("/restaurants/search", {
            params: {
              query,
              latitude,
              longitude,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (
            response.status === 200 &&
            response.data &&
            response.data.message &&
            response.data.message.length > 0
          ) {
            setRestaurants(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      } else {
        try {
          const response = await client.get("/restaurants/search", {
            params: {
              query,
              latitude,
              longitude,
            },
          });

          if (
            response.status === 200 &&
            response.data &&
            response.data.message &&
            response.data.message.length > 0
          ) {
            setRestaurants(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    } else if (filter === "users") {
      try {
        const response = await client.get("/users/search", {
          params: { query },
        });
        if (response.status === 200 && response.data) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  if (isLoading) {
    return <LoadingSection />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="検索"
        />
        {query && (
          <CancelIcon className={styles.clearButton} onClick={clearInput} />
        )}
        <SearchIcon className={styles.icon} />
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => setFilter("restaurants")}
          className={`${styles.button} ${
            filter === "restaurants" ? styles.active : ""
          }`}
        >
          レストラン
        </button>
        <button
          onClick={() => setFilter("users")}
          className={`${styles.button} ${
            filter === "users" ? styles.active : ""
          }`}
        >
          ユーザー
        </button>
      </div>

      {filter === "restaurants" ? (
        <div className={styles.restaurantContainer}>
          <div className={styles.restaurantList}>
            {restaurants.map((restaurant, index) => (
              <RestaurantListItem
                key={restaurant.placeId}
                restaurant={restaurant}
                setSelectedRestaurant={setSelectedRestaurant}
              />
            ))}
          </div>
          {selectedRestaurant && (
            <RestaurantInfo
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={() => setSelectedRestaurant(null)}
              setRestaurants={setRestaurants}
            />
          )}
        </div>
      ) : (
        <div className={styles.userContainer}>
          <div className={styles.restaurantList}>
            {users.map((user, index) => (
              <UserListItem key={user.sub} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
