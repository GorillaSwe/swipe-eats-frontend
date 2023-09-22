import client from "utils/api/client"

// 動作確認用
export const showRestaurants = async (latitude: number, longitude: number) => {
  try {
    const response = await client.get("/restaurants", {
      params: { latitude, longitude },
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