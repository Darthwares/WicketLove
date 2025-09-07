/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'firebasestorage.googleapis.com', // Firebase storage
      'wicketlove-66015.firebasestorage.app', // Firebase storage
    ],
  },
};

// PWA configuration will be enabled after fixing the dependency
module.exports = nextConfig;