/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cors-proxy.rdpsell01.workers.dev',
      'm.media-amazon.com',
      'image.tmdb.org',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/category/:genre',
        destination: '/category/[genre]',
      },
    ]
  },
}

module.exports = nextConfig