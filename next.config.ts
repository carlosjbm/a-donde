import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.43.57", "10.112.1.26", "192.168.15.112"],
  serverExternalPackages: ["mysql2"],
};

export default nextConfig;
