import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

// Generate JWT token
export function generateToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE } as any);
}

// Verify JWT token from request
export async function verifyToken(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Check cookies
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return { userId: decoded.id };
  } catch (error) {
    return null;
  }
}

// Send token response
export function sendTokenResponse(user: any, token: string) {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  const response = NextResponse.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set('token', token, cookieOptions);
  return response;
}

// Middleware to protect routes
export async function requireAuth(request: NextRequest, User: any): Promise<{ user: any; error?: NextResponse }> {
  const tokenData = await verifyToken(request);

  if (!tokenData) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Not authorized to access this route' },
        { status: 401 }
      ),
    };
  }

  try {
    const user = await User.findById(tokenData.userId).select('-password');

    if (!user || !user.isActive) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: 'User not found or inactive' },
          { status: 401 }
        ),
      };
    }

    return { user };
  } catch (error) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      ),
    };
  }
}

// Check if user has required role
export function authorizeRole(user: any, roles: string[]): boolean {
  return roles.includes(user.role);
}
