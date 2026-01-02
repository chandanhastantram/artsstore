import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/app/models/Settings';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';

// GET /api/settings - Public settings
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // @ts-ignore - getSettings is a static method
    const settings = await Settings.getSettings();

    // Return public settings (safe for frontend display)
    const publicSettings = {
      storeName: settings.storeName,
      storeEmail: settings.storeEmail,
      storePhone: settings.storePhone,
      storeAddress: settings.storeAddress,
      socialMedia: settings.socialMedia,
      currency: settings.currency,
      shipping: {
        freeShippingThreshold: settings.shipping.freeShippingThreshold,
        flatRate: settings.shipping.flatRate
      },
      tax: {
        enabled: settings.tax.enabled,
        rate: settings.tax.rate
      }
    };

    return NextResponse.json({
      success: true,
      data: publicSettings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error fetching settings', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings (Super Admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Only super admins can update settings' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // @ts-ignore - getSettings is a static method
    const settings = await Settings.getSettings();

    // Update allowed fields
    const allowedFields = [
      'storeName',
      'storeEmail',
      'storePhone',
      'storeAddress',
      'branding',
      'theme',
      'banner',
      'socialMedia',
      'shipping',
      'tax',
      'currency',
      'contactPage',
      'seo',
      'businessHours'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    });

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error updating settings', error: error.message },
      { status: 500 }
    );
  }
}
