# Admin Credentials - MegaArtsStore

## Demo Admin Accounts

### Super Admin Account
**Full access to all features including:**
- Product management
- Customization options management
- Order management
- User management
- Admin user management
- CMS control
- Analytics dashboard
- Coupon management

**Credentials:**
```
Email: superadmin@megaartsstore.com
Password: SuperAdmin@123
```

---

### Admin Account
**Limited access including:**
- Product management (add, edit, delete products)
- Order management (view and update order status)
- Coupon management

**Credentials:**
```
Email: admin@megaartsstore.com
Password: Admin@123
```

---

### Regular User Account (for testing)
**Customer features:**
- Browse and purchase products
- Customize products
- Use AR try-on
- Manage cart and wishlist
- Track orders

**Credentials:**
```
Email: user@megaartsstore.com
Password: User@123
```

---

## Creating Admin Accounts

### Method 1: Using MongoDB Directly

1. Connect to your MongoDB database
2. Insert a user document with admin role:

```javascript
db.users.insertOne({
  name: "Admin Name",
  email: "admin@example.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  role: "superadmin", // or "admin"
  isActive: true,
  createdAt: new Date()
})
```

### Method 2: Using the API

1. Register a regular user via `/api/auth/register`
2. As a Super Admin, update the user's role via `/api/users/:id/role`

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID/role \
  -H "Authorization: Bearer SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

---

## Role Permissions

### Super Admin
- ✅ All Admin permissions
- ✅ Manage customization options (thread colors, kundan types, etc.)
- ✅ Manage other admin users
- ✅ View analytics and reports
- ✅ Manage CMS content
- ✅ Full system control

### Admin
- ✅ Manage products (CRUD operations)
- ✅ View and update orders
- ✅ Manage coupons
- ❌ Cannot manage customization options
- ❌ Cannot manage users or other admins
- ❌ Cannot access analytics dashboard
- ❌ Cannot manage CMS content

### User
- ✅ Browse products
- ✅ Customize products
- ✅ Add to cart and wishlist
- ✅ Place orders
- ✅ View own orders
- ✅ Write reviews
- ❌ No admin panel access

---

## Security Best Practices

1. **Change Default Passwords**: Immediately change all default passwords in production
2. **Use Strong Passwords**: Minimum 12 characters with uppercase, lowercase, numbers, and symbols
3. **Enable 2FA**: Implement two-factor authentication for admin accounts (future enhancement)
4. **Regular Audits**: Review admin access logs regularly
5. **Limit Admin Accounts**: Only create admin accounts when necessary
6. **Revoke Access**: Deactivate admin accounts when no longer needed

---

## Password Reset

If you forget an admin password:

1. Use the password reset feature (if implemented)
2. Or directly update in MongoDB:

```javascript
// Hash a new password using bcrypt
const bcrypt = require('bcryptjs');
const newPassword = await bcrypt.hash('NewPassword@123', 10);

// Update in database
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { password: newPassword } }
)
```

---

## Initial Setup Script

To create initial admin accounts, you can run this script:

```javascript
// server/scripts/createAdmins.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmins() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Create Super Admin
  await User.create({
    name: 'Super Admin',
    email: 'superadmin@megaartsstore.com',
    password: 'SuperAdmin@123', // Will be hashed by pre-save hook
    role: 'superadmin',
    isActive: true,
  });

  // Create Admin
  await User.create({
    name: 'Admin',
    email: 'admin@megaartsstore.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  });

  console.log('Admin accounts created successfully');
  process.exit(0);
}

createAdmins();
```

Run with: `node server/scripts/createAdmins.js`

---

## Support

For admin account issues, contact: tech-support@megaartsstore.com

**⚠️ IMPORTANT: Never share admin credentials publicly or commit them to version control!**
