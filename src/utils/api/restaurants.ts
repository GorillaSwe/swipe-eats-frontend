import client from "utils/api/client"

export const showRestaurants = async (
  latitude: number,
  longitude: number,
  category: string,
  radius: number,
  priceLevels: number[],
  sortParam: string
) => {
  try {
    const response = await client.get("/restaurants", {
      params: { latitude, longitude, category, radius, priceLevels, sortParam },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("APIからデータを取得できませんでした。");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};