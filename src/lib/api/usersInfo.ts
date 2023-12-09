import client from "@/lib/api/apiClient";
import { UserData } from "@/types/UserData";

const createUser = async (token: string | null, userData: UserData) => {
  try {
    await client.post(`/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error creaeting user data: ", error);
  }
};

const getUserProfile = async (userSub: string | null | undefined) => {
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
    const data = await response.data;
    return data.users || [];
  } catch (error) {
    console.error("Error fetching users data: ", error);
    return [];
  }
};

export { createUser, getUserProfile, searchUsers };
