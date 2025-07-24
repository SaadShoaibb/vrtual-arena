import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vrtualarena.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vrtualarena.ca',
        pathname: '/**',
      }
    ],
  }
};

export default withNextIntl(nextConfig);
