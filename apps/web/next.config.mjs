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
  },
  transpilePackages: [
    "@tiptap/extension-code-block-lowlight",
    "lowlight",
    "highlight.js"
  ],
  webpack: (config) => {
    // Handle ES modules that use import.meta
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });
    
    return config;
  }
};

export default withBundleAnalyzer(nextConfig);
