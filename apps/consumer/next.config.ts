import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: ["@smart-menu/ui", "@smart-menu/api"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ykjkdyesejssidyqwqpc.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "drive.google.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
