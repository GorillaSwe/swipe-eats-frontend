"use client";

import { useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { NextPage } from "next";

import RestaurantInfo from "@/features/search/components/RestaurantInfo";
import RestaurantListItem from "@/features/search/components/RestaurantListItem";
import client from "@/lib/apiClient";
import { RestaurantData } from "@/types/RestaurantData";

import styles from "./page.module.scss";

const SearchPage: NextPage<{}> = () => {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<null | RestaurantData>(null);

  const clearInput = () => {
    setQuery("");
  };

  const handleSearch = async () => {
    try {
      const tokenResponse = await fetch("/api/token");
      const tokenData = await tokenResponse.json();
      const token = tokenData.accessToken;

      const response = await client.get("/restaurants/search", {
        params: { query },
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
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

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
    </div>
  );
};

export default SearchPage;
