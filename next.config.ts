import withPWA from "next-pwa";
import type { NextConfig } from "next";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // ...
});

const nextConfig: NextConfig = {
  // Your existing config options
  // ...
  turbopack: {}, // Add empty turbopack config to prevent warnings
};

export default pwaConfig(nextConfig);