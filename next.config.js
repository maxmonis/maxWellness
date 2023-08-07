const withPWA = require("next-pwa")({
  dest: "public",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      /* Google auth user initial image */
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
}

module.exports =
  process.env.NODE_ENV === "production" ? withPWA(nextConfig) : nextConfig
