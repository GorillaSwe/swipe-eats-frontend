/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "maps.googleapis.com",
      "developers.google.com",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
