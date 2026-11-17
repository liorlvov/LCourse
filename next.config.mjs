/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    // the course used to live at /course/...
    return [
      { source: '/course', destination: '/bgu/physics-3/map', permanent: true },
      { source: '/course/:tab', destination: '/bgu/physics-3/:tab', permanent: true },
    ];
  },
};
export default nextConfig;
