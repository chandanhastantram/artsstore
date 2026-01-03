# Quick Vercel Environment Variables Setup
# This file contains the commands to add environment variables to Vercel
# Replace the placeholder values with your actual credentials

# IMPORTANT: Get your Cloudinary credentials from: https://cloudinary.com/console

# Add Cloudinary Cloud Name (already set, but included for completeness)
echo "your_cloud_name_here" | vercel env add CLOUDINARY_CLOUD_NAME production --yes

# Add Cloudinary API Key
echo "your_api_key_here" | vercel env add CLOUDINARY_API_KEY production --yes

# Add Cloudinary API Secret
echo "your_api_secret_here" | vercel env add CLOUDINARY_API_SECRET production --yes

# Add MongoDB URI
echo "your_mongodb_uri_here" | vercel env add MONGODB_URI production --yes

# Add JWT Secret (generate with: openssl rand -base64 32)
echo "your_jwt_secret_here" | vercel env add JWT_SECRET production --yes

# Verify all variables are set
vercel env ls

Write-Host "Environment variables added! Now deploy with: vercel --prod" -ForegroundColor Green
