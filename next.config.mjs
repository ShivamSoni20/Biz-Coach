/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/bizcoachslides",
        destination: "/biz-coach-pitch-deck.html"
      }
    ];
  }
};

export default nextConfig;
