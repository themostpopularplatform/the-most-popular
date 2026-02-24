/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    serverActions: {},
  },
  outputFileTracingRoot: path.join(__dirname, './'),
};

module.exports = nextConfig;