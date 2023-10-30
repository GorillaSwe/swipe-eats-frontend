import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
  ignoreHeaders: true,
};

const client = applyCaseMiddleware(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  options
);

export default client;
