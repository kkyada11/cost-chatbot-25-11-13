/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["zustand", "@tanstack/react-query"],
  },
};

module.exports = nextConfig;
