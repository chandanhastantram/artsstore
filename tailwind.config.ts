import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ivory: {
                    50: '#FFFFFF',
                    100: '#FAF9F6',
                    200: '#F5F3EE',
                    300: '#F0EDE6',
                    400: '#EBE7DE',
                },
                gold: {
                    50: '#FFF9E6',
                    100: '#FFF3CC',
                    200: '#FFE799',
                    300: '#FFDB66',
                    400: '#E8C547',
                    500: '#D4AF37',
                    600: '#C9A961',
                    700: '#B8941F',
                    800: '#8B7016',
                    900: '#5E4B0E',
                },
                maroon: {
                    50: '#FFE6E6',
                    100: '#FFCCCC',
                    200: '#FF9999',
                    300: '#FF6666',
                    400: '#CC0033',
                    500: '#800020',
                    600: '#66001A',
                    700: '#4D0013',
                    800: '#33000D',
                    900: '#1A0007',
                },
                emerald: {
                    50: '#E6FFF4',
                    100: '#CCFFE9',
                    200: '#99FFD3',
                    300: '#66FFBD',
                    400: '#50C878',
                    500: '#3DB864',
                    600: '#2A9D50',
                    700: '#1F7A3D',
                    800: '#145229',
                    900: '#0A2915',
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'luxury': '0 10px 40px rgba(212, 175, 55, 0.1)',
                'luxury-hover': '0 15px 50px rgba(212, 175, 55, 0.2)',
            },
        },
    },
    plugins: [],
};

export default config;
