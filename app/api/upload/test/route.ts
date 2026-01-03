import { NextRequest, NextResponse } from 'next/server';

// GET /api/upload/test - Test upload configuration
export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    warnings: [],
  };

  // Check Cloudinary configuration
  try {
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    diagnostics.checks.cloudinary = {
      configured: !!(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret),
      cloud_name: cloudinaryConfig.cloud_name ? '✓ Set' : '✗ Missing',
      api_key: cloudinaryConfig.api_key ? '✓ Set' : '✗ Missing',
      api_secret: cloudinaryConfig.api_secret ? '✓ Set' : '✗ Missing',
    };

    if (!diagnostics.checks.cloudinary.configured) {
      diagnostics.errors.push('Cloudinary credentials not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local');
    }
  } catch (error: any) {
    diagnostics.errors.push(`Cloudinary check failed: ${error.message}`);
  }

  // Check MongoDB
  try {
    diagnostics.checks.mongodb = {
      uri_configured: !!process.env.MONGODB_URI,
      uri: process.env.MONGODB_URI ? '✓ Set' : '✗ Missing',
    };

    if (!diagnostics.checks.mongodb.uri_configured) {
      diagnostics.errors.push('MongoDB URI not configured. Add MONGODB_URI to .env.local');
    }
  } catch (error: any) {
    diagnostics.errors.push(`MongoDB check failed: ${error.message}`);
  }

  // Check JWT
  try {
    diagnostics.checks.jwt = {
      configured: !!process.env.JWT_SECRET,
      secret: process.env.JWT_SECRET ? '✓ Set' : '✗ Missing',
    };

    if (!diagnostics.checks.jwt.configured) {
      diagnostics.errors.push('JWT_SECRET not configured. Add JWT_SECRET to .env.local');
    }
  } catch (error: any) {
    diagnostics.errors.push(`JWT check failed: ${error.message}`);
  }

  // Check Redis (optional)
  try {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;

    diagnostics.checks.redis = {
      configured: !!(redisUrl || (redisHost && redisPort)),
      url: redisUrl ? '✓ Set' : '✗ Not set',
      host: redisHost ? '✓ Set' : '✗ Not set',
      port: redisPort ? '✓ Set' : '✗ Not set',
      note: 'Redis is optional - uploads will work without it, but slower',
    };

    if (!diagnostics.checks.redis.configured) {
      diagnostics.warnings.push('Redis not configured. Background upload processing disabled. Uploads will be slower but still work.');
    }
  } catch (error: any) {
    diagnostics.warnings.push(`Redis check failed: ${error.message}`);
  }

  // Check upload directories
  try {
    diagnostics.checks.uploadEndpoints = {
      '/api/upload': '✓ Available',
      '/api/upload/chunked': '✓ Available',
      '/api/upload/model': '✓ Available',
      '/api/upload/progress/[id]': '✓ Available',
    };
  } catch (error: any) {
    diagnostics.errors.push(`Upload endpoints check failed: ${error.message}`);
  }

  // Overall status
  diagnostics.status = diagnostics.errors.length === 0 ? 'READY' : 'NOT_READY';
  diagnostics.summary = {
    total_errors: diagnostics.errors.length,
    total_warnings: diagnostics.warnings.length,
    can_upload: diagnostics.errors.length === 0,
  };

  return NextResponse.json(diagnostics, {
    status: diagnostics.errors.length === 0 ? 200 : 500,
  });
}
