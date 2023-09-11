import client from "lib/api/client"

// 動作確認用
export const showRestaurants = async () => {
  try {
    const response = await client.get("/restaurants");
    if (response.status === 200) {
      return response; // ここではデータをそのまま返す
    } else {
      throw new Error("APIからデータを取得できませんでした。");
    }
  } catch (error) {
    console.error(error);
  }
};