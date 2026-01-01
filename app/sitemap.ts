import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://megaartsstore.com';
    
    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/faq',
        '/cart',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // TODO: Add dynamic product pages
    // Fetch products from API and add to sitemap
    // const products = await fetchProducts();
    // const productPages = products.map((product) => ({
    //     url: `${baseUrl}/product/${product._id}`,
    //     lastModified: new Date(product.updatedAt),
    //     changeFrequency: 'daily' as const,
    //     priority: 0.7,
    // }));

    return [
        ...staticPages,
        // ...productPages,
    ];
}
