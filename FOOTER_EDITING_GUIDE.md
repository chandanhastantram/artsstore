# Footer Address Editing - Quick Guide

## ✅ What's Enabled

Super admins can now edit the footer address and all store information through the admin settings page.

## 📍 How to Edit Footer Address

### Step 1: Access Admin Settings

1. Log in as **super admin**
2. Navigate to: **Admin Dashboard** → **Settings**
3. Or go directly to: `/admin/settings`

### Step 2: Edit Store Address

In the **Store Address** section, you can edit:

- Street Address
- City
- State
- ZIP Code
- Country

### Step 3: Save Changes

Click the **"Save Settings"** button at the bottom of the page.

### Step 4: View Changes

The footer on all pages will automatically update with the new address!

## 🎯 What Else Can Be Edited

Super admins can also edit:

### Store Information

- Store Name
- Store Email
- Store Phone

### Social Media Links

- Facebook
- Instagram
- WhatsApp
- YouTube

### Shipping Settings

- Free Shipping Threshold
- Flat Shipping Rate

### Tax Settings

- Enable/Disable Tax
- Tax Rate
- GST Number

### Contact Page Settings

- Page Heading & Subheading
- Contact Email & Phone
- Contact Address
- Working Hours
- Google Maps Embed URL

## 🔒 Permissions

- **Super Admin**: Can edit ALL settings
- **Admin**: Can VIEW settings but cannot edit
- **Regular Users**: Can only see public information in footer

## 🛠️ Technical Details

### API Endpoints Created:

- `GET /api/settings` - Public settings (used by footer)
- `GET /api/settings/admin` - All settings (admin panel)
- `PUT /api/settings` - Update settings (super admin only)

### Files Modified:

- [`app/api/settings/route.ts`](file:///c:/Users/chand/.gemini/antigravity/scratch/megaartsstore/app/api/settings/route.ts) - Main settings API
- [`app/api/settings/admin/route.ts`](file:///c:/Users/chand/.gemini/antigravity/scratch/megaartsstore/app/api/settings/admin/route.ts) - Admin settings API
- [`components/layout/Footer.tsx`](file:///c:/Users/chand/.gemini/antigravity/scratch/megaartsstore/components/layout/Footer.tsx) - Updated to use new API

### Settings Page:

- [`app/admin/settings/page.tsx`](file:///c:/Users/chand/.gemini/antigravity/scratch/megaartsstore/app/admin/settings/page.tsx) - Already exists with full editing interface

## 📝 Example Usage

```typescript
// Footer automatically fetches and displays settings
const response = await fetch("/api/settings");
const { data } = await response.json();

// Address is displayed as:
// "123 Heritage Lane, Jaipur, Rajasthan, India"
```

## ⚠️ Important Notes

1. **Current Implementation**: Settings are stored in memory. They will reset when the server restarts.
2. **Production Ready**: For production, replace the in-memory store with a MongoDB model.
3. **Real-time Updates**: Changes appear immediately in the footer after saving.

## 🚀 Future Enhancements

To make this production-ready, you should:

1. Create a MongoDB Settings model
2. Store settings in database
3. Add settings history/audit log
4. Add image upload for store logo
5. Add more customization options

---

**Ready to use!** Super admins can now edit the footer address anytime through the admin settings page.
