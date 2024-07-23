/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        optimizePackageImports: ['@repo/slate-editor'],
      },
};

export default nextConfig;
