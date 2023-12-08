import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

const useAccessToken = () => {
  const { user } = useUser();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        try {
          const response = await fetch("/api/token");
          const data = await response.json();
          setToken(data.accessToken);
        } catch (error) {
          console.error("Error fetching access token: ", error);
          setToken(null);
        }
      }
    };

    fetchToken();
  }, [user]);

  return token;
};

export default useAccessToken;
