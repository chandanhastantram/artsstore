import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
    title: 'MegaArtsStore - Luxury Kundan Bangles & Handcrafted Jewelry',
    description: 'Discover exquisite handcrafted Kundan bangles, traditional Indian handicrafts, and artistic décor. Premium quality, royal heritage craftsmanship.',
    keywords: 'kundan bangles, handcrafted jewelry, Indian handicrafts, luxury bangles, traditional jewelry',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable}`}>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <main className="min-h-screen">{children}</main>
                        <Footer />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#FAF9F6',
                                    color: '#2C2C2C',
                                    border: '1px solid #D4AF37',
                                },
                            }}
                        />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
