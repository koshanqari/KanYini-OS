/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'keaprojects.com.au',
      },
    ],
  },
};

export default nextConfig;

