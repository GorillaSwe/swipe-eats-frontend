import client from "@/lib/api/apiClient";

const getFollowRelationships = async (
  userSub: string | null | undefined,
  token: string | null
) => {
  try {
    const response = await client.get(`/follow_relationships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userSub: userSub },
    });
    return response.data.isFollowing;
  } catch (error) {
    console.error("Error fetching follow relationships data: ", error);
    return [];
  }
};

const getFollowRelationshipsCounts = async (
  userSub: string | null | undefined
) => {
  try {
    const response = await client.get(`/follow_relationships/counts`, {
      params: { userSub: userSub },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data || [];
    }

    throw new Error("Error fetching relationships counts");
  } catch (error) {
    console.error("Error fetching relaionships counts data: ", error);
    return [];
  }
};

const followRelationships = async (
  userSub: string | null | undefined,
  token: string | null
) => {
  try {
    const response = await client.post(
      `/follow_relationships`,
      { userSub: userSub },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error following: ", error);
    return [];
  }
};

const unfollowRelationships = async (
  userSub: string | null | undefined,
  token: string | null
) => {
  try {
    const response = await client.delete(
      `/follow_relationships/destroy_by_user_sub/${userSub}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error unfollowing: ", error);
    return [];
  }
};

export {
  getFollowRelationships,
  getFollowRelationshipsCounts,
  followRelationships,
  unfollowRelationships,
};
