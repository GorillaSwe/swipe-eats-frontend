import client from "@/lib/api/apiClient";

const getUsersProfile = async (userSub: string | null | undefined) => {
  try {
    const response = await client.get(`/users/get_user_profile`, {
      params: { userSub },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile data: ", error);
    return [];
  }
};

const searchUsers = async (query: string) => {
  try {
    const response = await client.get("/users/search", {
      params: { query },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data.users || [];
    }

    throw new Error("Error fetching users");
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return [];
  }
};

export { getUsersProfile, searchUsers };
