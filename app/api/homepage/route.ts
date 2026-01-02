import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/app/models/Settings';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';

// GET /api/homepage - Get homepage settings (public)
export async function GET() {
    try {
        await connectDB();
        
        // @ts-ignore - getSettings is a static method
        const settings = await Settings.getSettings();
        
        return NextResponse.json({
            success: true,
            data: {
                heroSlides: settings.homepage?.heroSlides || [],
                featuredSection: settings.homepage?.featuredSection || {
                    enabled: true,
                    title: 'Featured Collection',
                    subtitle: 'Handpicked pieces showcasing our finest craftsmanship',
                    displayCount: 6,
                    autoPlay: true,
                    autoPlaySpeed: 3000
                },
                features: settings.homepage?.features || [],
                artisanStory: settings.homepage?.artisanStory || {
                    enabled: true,
                    title: 'Heritage of Craftsmanship',
                    highlightedText: 'Craftsmanship',
                    content: 'Each piece at MegaArtsStore is a testament to centuries-old traditions.',
                    additionalContent: 'We work directly with artisan families in Rajasthan.',
                    buttonText: 'Learn More About Us',
                    buttonLink: '/about',
                    image: ''
                },
                testimonials: settings.homepage?.testimonials || [],
                ctaSection: settings.homepage?.ctaSection || {
                    enabled: true,
                    title: 'Ready to Find Your Perfect Piece?',
                    subtitle: 'Explore our collection and create something uniquely yours',
                    buttonText: 'Start Shopping',
                    buttonLink: '/shop'
                },
                banner: settings.banner
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/homepage - Update homepage settings (superadmin only)
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const { user, error } = await requireAuth(request, User);

        if (error) return error;

        if (!authorizeRole(user, ['superadmin'])) {
            return NextResponse.json(
                { success: false, message: 'Only super admins can edit homepage' },
                { status: 403 }
            );
        }

        const body = await request.json();

        // @ts-ignore - getSettings is a static method
        const settings = await Settings.getSettings();

        // Update homepage fields
        if (body.heroSlides !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.heroSlides = body.heroSlides;
        }
        if (body.featuredSection !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.featuredSection = body.featuredSection;
        }
        if (body.features !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.features = body.features;
        }
        if (body.artisanStory !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.artisanStory = body.artisanStory;
        }
        if (body.testimonials !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.testimonials = body.testimonials;
        }
        if (body.ctaSection !== undefined) {
            settings.homepage = settings.homepage || {};
            settings.homepage.ctaSection = body.ctaSection;
        }

        await settings.save();

        return NextResponse.json({
            success: true,
            message: 'Homepage settings updated successfully',
            data: settings.homepage
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
