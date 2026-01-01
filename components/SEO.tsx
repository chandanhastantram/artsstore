// SEO component for meta tags and structured data

import Head from 'next/head';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    structuredData?: object;
}

export default function SEO({
    title,
    description,
    keywords = 'handmade jewelry, kundan bangles, handicrafts, art decor, MegaArtsStore',
    ogImage = '/images/og-default.jpg',
    ogType = 'website',
    canonicalUrl,
    structuredData,
}: SEOProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://megaartsstore.com';
    const fullTitle = `${title} | MegaArtsStore`;
    const canonical = canonicalUrl || siteUrl;
    const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content="MegaArtsStore" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
        </Head>
    );
}

// Helper function to generate product structured data
export function generateProductStructuredData(product: any) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        brand: {
            '@type': 'Brand',
            name: 'MegaArtsStore',
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product._id}`,
        },
        aggregateRating: product.ratings.count > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratings.average,
            reviewCount: product.ratings.count,
        } : undefined,
    };
}
