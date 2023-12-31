import client from "@/lib/api/apiClient";

const getFavoritesInfo = async (token: string | null, page: number) => {
  try {
    const response = await client.get("/favorites", {
      params: { page },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.favorites;
  } catch (error) {
    console.error("Error fetching favorites data: ", error);
    return [];
  }
};

const getOtherFavoritesInfo = async (
  userSub: string | null | undefined,
  page: number
) => {
  try {
    const response = await client.get(`/favorites/other_index`, {
      params: { userSub, page },
    });
    return response.data.favorites;
  } catch (error) {
    console.error("Error fetching other favorites data: ", error);
    return [];
  }
};

const getHomeFavoritesInfo = async (token: string | null, page: number) => {
  try {
    const response = await client.get("/favorites/followed", {
      params: { page },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.favorites;
  } catch (error) {
    console.error("Error fetching home favorites data: ", error);
    return [];
  }
};

const getFavoritesCount = async (userSub: string | null | undefined) => {
  try {
    const response = await client.get(`/favorites/counts`, {
      params: { userSub: userSub },
    });
    const data = await response.data;
    return data.favoritesCount || 0;
  } catch (error) {
    console.error("Error fetching favorites count data: ", error);
    return 0;
  }
};

const addFavorite = async (
  token: string | null,
  placeId: string,
  userRating: number | null,
  userComment: string | null
) => {
  try {
    const response = await client.post(
      `/favorites`,
      { placeId: placeId, userRating: userRating, userComment: userComment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error add favorite data: ", error);
  }
};

const deleteFavorite = async (token: string | null, placeId: string) => {
  try {
    await client.delete(`/favorites/destroy_by_place_id/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error delete favorite data: ", error);
  }
};

export {
  getFavoritesInfo,
  getOtherFavoritesInfo,
  getHomeFavoritesInfo,
  getFavoritesCount,
  addFavorite,
  deleteFavorite,
};
