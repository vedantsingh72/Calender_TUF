import type { NextConfig } from "next";

// If `.next` renames fail on Windows (e.g. OneDrive), try `npm run dev:fresh`.
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
