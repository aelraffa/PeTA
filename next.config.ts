/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will display the image while developing
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placeholder.com',
      },
    ],
  },
  // Ensure we handle trailing slashes correctly
  trailingSlash: false,
}

export default nextConfig;