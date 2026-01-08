import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Tell Next.js to digest these specific packages
  transpilePackages: ['react-pdf', 'pdfjs-dist'],

  // 2. Standard Webpack fix for PDF libraries
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  
  // 3. Disable strict mode if the error persists (optional, but helps with PDF workers)
  reactStrictMode: false, 
};

export default nextConfig;