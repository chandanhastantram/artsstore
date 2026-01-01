/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'res.cloudinary.com'],
    },
    transpilePackages: ['three'],
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
}

module.exports = nextConfig
