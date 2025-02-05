/** @type {import('next').NextConfig} */

const nextConfig = {
    transpilePackages: [
        '@cloudscape-design/components',
        '@cloudscape-design/component-toolkit'
    ],
    images: {
        remotePatterns: [
            // { protocol: 'https', hostname: 'storage.googleapis.com' }
        ]
    },
};


export default nextConfig;