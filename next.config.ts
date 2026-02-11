import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "framerusercontent.com",
    ], // Add your image host domains for next/image
  },
};

export default nextConfig;
