/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'svtbqdpulegufprcnppi.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-agenda-web.wfrhms.easypanel.host';
        return [
            {
                source: '/api/v1/:path*',
                destination: `${apiUrl}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;
