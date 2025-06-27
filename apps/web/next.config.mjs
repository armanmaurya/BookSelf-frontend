import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "media-storage-bucket-123.s3.amazonaws.com",
        hostname: "**",
      }
    ]
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['', "slate", "slate-react"]
  }
};

export default withBundleAnalyzer(nextConfig);
