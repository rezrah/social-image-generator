/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:
    process.env.NODE_ENV === "production" ? "/social-image-generator" : "",
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
