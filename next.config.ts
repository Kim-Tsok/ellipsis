import { withPWA } from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing config options
  // ...
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // ...
})(nextConfig);

export default pwaConfig;