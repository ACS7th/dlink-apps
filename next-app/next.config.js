/** @type {import('next').NextConfig} */
const url = require("url");

const SPRING_HOST = process.env.SPRING_URI
  ? new url.URL(process.env.SPRING_URI).hostname
  : null;

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com", SPRING_HOST].filter(Boolean),
    domains: ['kaja2002.com'],
  },

};

module.exports = nextConfig;