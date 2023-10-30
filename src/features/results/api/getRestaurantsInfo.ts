import client from "@/lib/apiClient";

export const getRestaurantsInfo = async (
  latitude: number,
  longitude: number,
  category: string,
  radius: number,
  price: number[],
  sort: string
) => {
  const response = await client.get("/restaurants", {
    params: { latitude, longitude, category, radius, price, sort },
  });

  if (
    response.status === 200 &&
    response.data &&
    response.data.message &&
    response.data.message.length > 0
  ) {
    return response.data;
  } else {
    throw new Error(
      response.data.error || "該当するレストランが見つかりませんでした。"
    );
  }
};
