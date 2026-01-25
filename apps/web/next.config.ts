import type { NextConfig } from "next";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ykjkdyesejssidyqwqpc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer
    if (!dev && process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : '../analyze/client.html',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },
};

export default nextConfig;
