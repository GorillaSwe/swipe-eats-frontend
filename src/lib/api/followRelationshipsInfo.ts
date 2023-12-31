import client from "@/lib/api/apiClient";

const getFollowRelationship = async (
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
    console.error("Error fetching follow relationship data: ", error);
    return false;
  }
};

const getFollowRelationshipsCount = async (
  userSub: string | null | undefined
) => {
  try {
    const response = await client.get(`/follow_relationships/counts`, {
      params: { userSub: userSub },
    });
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.error("Error fetching follow relaionships count data: ", error);
    return [];
  }
};

const followRelationship = async (
  userSub: string | null | undefined,
  token: string | null
) => {
  try {
    await client.post(
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
  }
};

const unfollowRelationship = async (
  userSub: string | null | undefined,
  token: string | null
) => {
  try {
    await client.delete(
      `/follow_relationships/destroy_by_user_sub/${userSub}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error unfollowing: ", error);
  }
};

const getFollowing = async (userSub: string | null | undefined) => {
  try {
    const response = await client.get(`/follow_relationships/following`, {
      params: { userSub: userSub },
    });
    const data = await response.data.following;
    return data || [];
  } catch (error) {
    console.error("Error fetching following data: ", error);
    return [];
  }
};

const getFollowers = async (userSub: string | null | undefined) => {
  try {
    const response = await client.get(`/follow_relationships/followers`, {
      params: { userSub: userSub },
    });
    const data = await response.data.followers;
    return data || [];
  } catch (error) {
    console.error("Error fetching followings data: ", error);
    return [];
  }
};

export {
  getFollowRelationship,
  getFollowRelationshipsCount,
  followRelationship,
  unfollowRelationship,
  getFollowing,
  getFollowers,
};
