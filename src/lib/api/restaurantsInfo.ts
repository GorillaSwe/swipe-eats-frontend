import { UserProfile } from "@auth0/nextjs-auth0/client";

import client from "@/lib/api/apiClient";

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

    if (response.status === 200) {
      const data = await response.data;
      return data.message || [];
    }

    throw new Error("Error fetching restaurants");
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

export { searchRestaurants };
