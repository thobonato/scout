import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false, // Prevents validator from generating .js imports for .tsx routes
  /* config options here */
};

export default nextConfig;
