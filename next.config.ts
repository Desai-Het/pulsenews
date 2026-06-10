import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["11.46.162.57"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
