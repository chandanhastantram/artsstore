# Admin Setup Guide - MegaArtsStore

## Creating Your First Admin Account

### Prerequisites

- MongoDB Atlas configured
- Application environment variables set up
- Node.js installed

### Step 1: Run the Secure Admin Creation Tool

```bash
cd server
node scripts/createSecureAdmin.js
```

### Step 2: Follow the Interactive Prompts

The tool will guide you through:

1. **Admin Name**: Enter the full name of the admin user
2. **Email Address**: Enter a valid email (will be validated)
3. **Password**: Create a secure password meeting these requirements:
   - Minimum 12 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character (!@#$%^&\*...)
4. **Password Confirmation**: Re-enter the password
5. **Role Selection**:
   - **Super Admin**: Full access to all features
   - **Admin**: Limited access (products, orders, coupons only)

### Step 3: Save Your Credentials

**IMPORTANT**: Save the email and password securely. There is no password recovery system yet.

### Step 4: Login

Visit `/admin/login` and use your credentials to access the admin panel.

---

## Role Permissions

### Super Admin

✅ **Full System Access**

- Product management (CRUD)
- Order management
- User management
- Admin user management
- Customization options management
- CMS content management
- Analytics dashboard
- Coupon management
- System settings

### Admin

✅ **Limited Access**

- Product management (CRUD)
- Order management (view & update status)
- Coupon management

❌ **Restricted**

- Cannot manage users
- Cannot manage other admins
- Cannot access analytics
- Cannot manage customization options
- Cannot manage CMS content

---

## Security Best Practices

### Password Policy

- **Minimum Length**: 12 characters
- **Complexity**: Must include uppercase, lowercase, numbers, and special characters
- **No Common Passwords**: Avoid dictionary words, sequential numbers, etc.
- **Regular Updates**: Change passwords every 90 days (recommended)

### Account Security

1. **Never share admin credentials**
2. **Use unique passwords** (don't reuse passwords from other sites)
3. **Enable 2FA** (when available - future enhancement)
4. **Review access logs** regularly
5. **Deactivate unused accounts** immediately

### Access Control

- Only create admin accounts when absolutely necessary
- Use the **Admin** role for most users (principle of least privilege)
- Reserve **Super Admin** for trusted system administrators
- Regularly audit admin user list

---

## Managing Admin Accounts

### Creating Additional Admins

As a **Super Admin**, you can:

1. Run the `createSecureAdmin.js` script again for new admins
2. Or use the admin panel (future enhancement)

### Deactivating Admin Accounts

To deactivate an admin account:

```javascript
// Connect to MongoDB and update user
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isActive: false } }
);
```

### Resetting Admin Password

If an admin forgets their password:

```bash
# Run the password reset script (future enhancement)
# Or manually update in MongoDB:

const bcrypt = require('bcryptjs');
const newPassword = await bcrypt.hash('NewSecurePassword123!', 10);

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { password: newPassword } }
)
```

---

## Troubleshooting

### "Email already exists" Error

- An account with this email is already registered
- Use a different email address
- Or deactivate/delete the existing account first

### "Invalid email format" Error

- Ensure email follows standard format: `user@domain.com`
- No spaces or special characters (except @ and .)

### "Password does not meet requirements" Error

- Check all password requirements are met
- Ensure minimum 12 characters
- Include uppercase, lowercase, numbers, and symbols

### "Connection error" When Logging In

- Ensure MongoDB is connected
- Check environment variables are set correctly
- Verify backend server is running

---

## Support

For admin account issues or security concerns:

- Contact: tech-support@megaartsstore.com
- Or check the application logs for detailed error messages

---

**⚠️ SECURITY WARNING**

- Never commit admin credentials to version control
- Never share credentials via email or unsecured channels
- Always use the secure CLI tool to create admin accounts
- Regularly review and audit admin access
