/** @type {import('next').NextConfig} */
const nextConfig = {
  // Указываем базовый путь для размещения на tsvetkov.site/420
  basePath: '/420',
  // Оптимизация CSS (убирает блокирующие ресурсы)
  experimental: {
    optimizeCss: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
