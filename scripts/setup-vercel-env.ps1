# Vercel Environment Variables Setup Script
# Run this script to add all required environment variables to Vercel

Write-Host "=== Vercel Environment Variables Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Vercel CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "This script will help you add environment variables to Vercel." -ForegroundColor Green
Write-Host ""

# Get Cloudinary credentials
Write-Host "=== Cloudinary Configuration ===" -ForegroundColor Yellow
Write-Host "Get these from: https://cloudinary.com/console" -ForegroundColor Gray
Write-Host ""

$cloudName = Read-Host "Enter CLOUDINARY_CLOUD_NAME (current: ddbfd5n3x)"
if ([string]::IsNullOrWhiteSpace($cloudName)) {
    $cloudName = "ddbfd5n3x"
}

$apiKey = Read-Host "Enter CLOUDINARY_API_KEY"
$apiSecret = Read-Host "Enter CLOUDINARY_API_SECRET" -AsSecureString
$apiSecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiSecret)
)

# Get MongoDB URI
Write-Host ""
Write-Host "=== MongoDB Configuration ===" -ForegroundColor Yellow
$mongoUri = Read-Host "Enter MONGODB_URI"

# Get JWT Secret
Write-Host ""
Write-Host "=== JWT Configuration ===" -ForegroundColor Yellow
Write-Host "Tip: Generate a random secret with: openssl rand -base64 32" -ForegroundColor Gray
$jwtSecret = Read-Host "Enter JWT_SECRET"

# Confirm
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "CLOUDINARY_CLOUD_NAME: $cloudName"
Write-Host "CLOUDINARY_API_KEY: $apiKey"
Write-Host "CLOUDINARY_API_SECRET: ********"
Write-Host "MONGODB_URI: $mongoUri"
Write-Host "JWT_SECRET: ********"
Write-Host ""

$confirm = Read-Host "Add these variables to Vercel? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Add variables to Vercel
Write-Host ""
Write-Host "Adding variables to Vercel..." -ForegroundColor Green

# Function to add env var
function Add-VercelEnv {
    param($name, $value)
    Write-Host "Adding $name..." -ForegroundColor Gray
    echo $value | vercel env add $name production --yes 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $name added" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to add $name" -ForegroundColor Red
    }
}

Add-VercelEnv "CLOUDINARY_CLOUD_NAME" $cloudName
Add-VercelEnv "CLOUDINARY_API_KEY" $apiKey
Add-VercelEnv "CLOUDINARY_API_SECRET" $apiSecretPlain
Add-VercelEnv "MONGODB_URI" $mongoUri
Add-VercelEnv "JWT_SECRET" $jwtSecret

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Cyan
Write-Host "Environment variables have been added to Vercel." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit your code changes: git add . && git commit -m 'Fix upload configuration for Vercel'"
Write-Host "2. Deploy to Vercel: vercel --prod"
Write-Host "3. Test uploads on your deployed site"
