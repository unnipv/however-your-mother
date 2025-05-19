/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media0.giphy.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lgpbklbgbtdluqlhkqba.supabase.co',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig; 