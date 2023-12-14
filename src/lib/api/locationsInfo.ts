import client from "@/lib/api/apiClient";

const searchLocations = async (address: string) => {
  try {
    const response = await client.get("/locations/search", {
      params: { address },
    });
    return response.data.message;
  } catch (error) {
    console.error("Error fetching locations data: ", error);
    return [];
  }
};

export { searchLocations };
