/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/trail-sandiego',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
export default nextConfig
