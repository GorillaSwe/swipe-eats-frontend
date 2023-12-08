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

const getHomeFavoritesInfo = async (
  user: any,
  token: string | null,
  page: number
) => {
  const endpoint = user ? "/favorites/followed" : "/favorites/latest";

  try {
    const response = await client.get(endpoint, {
      params: { page },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.favorites;
  } catch (error) {
    console.error("Error fetching favorites data: ", error);
    return [];
  }
};

const getFavoritesCounts = async (userSub: string | null | undefined) => {
  try {
    const response = await client.get(`/favorites/counts`, {
      params: { userSub: userSub },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data.favoritesCount || 0;
    }

    throw new Error("Error fetching favorites counts");
  } catch (error) {
    console.error("Error fetching favorites counts data: ", error);
    return [];
  }
};

const addFavorites = async (token: string | null, placeId: string) => {
  try {
    await client.post(
      `/favorites`,
      { placeId: placeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error add favorite data: ", error);
    return [];
  }
};

const deleteFavorites = async (token: string | null, placeId: string) => {
  try {
    await client.delete(`/favorites/destroy_by_place_id/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error delete favorite data: ", error);
    return [];
  }
};

export {
  getFavoritesInfo,
  getOtherFavoritesInfo,
  getHomeFavoritesInfo,
  getFavoritesCounts,
  addFavorites,
  deleteFavorites,
};
