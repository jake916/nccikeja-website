import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Form emails read the logo from disk at runtime, which the build's file tracing can't see.
  outputFileTracingIncludes: {
    "/*": ["./assets/email-logo.png"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
