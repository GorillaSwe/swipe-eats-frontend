import { UserProfile } from "@auth0/nextjs-auth0/client";

import client from "@/lib/api/apiClient";

const getRestaurants = async (
  token: string | null,
  latitude: number,
  longitude: number,
  category: string,
  radius: number,
  price: number[],
  sort: string,
  user: UserProfile | undefined
) => {
  const response = await client.get("/restaurants", {
    params: { latitude, longitude, category, radius, price, sort },
    headers: user && token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 200 && response.data.message.length > 0) {
    return response.data;
  } else {
    console.error("Error fetching restaurants data: ", response.data.error);
    throw new Error(response.data.error || "レストランが見つかりません");
  }
};

const searchRestaurants = async (
  token: string | null,
  query: string,
  latitude: number | null,
  longitude: number | null,
  user: UserProfile | undefined
) => {
  try {
    const response = await client.get("/restaurants/search", {
      params: {
        query,
        latitude,
        longitude,
      },
      headers: user && token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.data;
    return data.message || [];
  } catch (error) {
    console.error("Error fetching restaurants data: ", error);
    return [];
  }
};

export { getRestaurants, searchRestaurants };
