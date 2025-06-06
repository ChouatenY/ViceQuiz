/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["string-similarity"],
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
};

export default nextConfig;
