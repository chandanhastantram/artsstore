/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'res.cloudinary.com'],
    },
    transpilePackages: ['three'],
}

module.exports = nextConfig
