import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  const repoEnv = process.env.GITHUB_REPOSITORY || "";
  const repo = repoEnv.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  
  output: 'export',

  images: {
    unoptimized: true, 
  },

  basePath: basePath,
  assetPrefix: assetPrefix,

  trailingSlash: true,

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  
  reactStrictMode: false, 
};

export default nextConfig;