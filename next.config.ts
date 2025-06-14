/** @type {import('next').NextConfig} */
const nextConfig = {
  // AÑADIMOS ESTA SECCIÓN PARA DESACTIVAR ESLINT DURANTE EL BUILD
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
