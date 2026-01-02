import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/app/models/Settings';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';

// GET /api/settings/admin - Get all settings (Admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['admin', 'superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to view settings' },
        { status: 403 }
      );
    }

    // @ts-ignore - getSettings is a static method
    const settings = await Settings.getSettings();

    // Return all settings including sensitive data for admin panel
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error fetching settings', error: error.message },
      { status: 500 }
    );
  }
}
