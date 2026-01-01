import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { generateToken, sendTokenResponse } from '@/lib/auth';
import type { IUser } from '@/types/user';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// POST /api/auth/register
export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  try {
    await connectDB();
    const body = await request.json();

    // Register
    if (pathname.endsWith('/register')) {
      const { name, email, password, phone } = body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      }

      const user = await User.create({ name, email, password, phone });
      const token = generateToken(user._id.toString());
      return sendTokenResponse(user, token);
    }

    // Login
    if (pathname.endsWith('/login')) {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Please provide email and password' },
          { status: 400 }
        );
      }

      const user = await User.findOne({ email }).select('+password') as IUser | null;
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, message: 'Account is inactive' },
          { status: 401 }
        );
      }

      const token = generateToken(user._id.toString());
      return sendTokenResponse(user, token);
    }

    // Logout
    if (pathname.endsWith('/logout')) {
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      });
      response.cookies.set('token', '', { expires: new Date(0) });
      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Route not found' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
