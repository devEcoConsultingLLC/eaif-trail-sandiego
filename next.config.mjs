/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/apps/eaif-trail-sd',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
export default nextConfig
