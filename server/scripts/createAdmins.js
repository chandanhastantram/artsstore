const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if users already exist
    const existingSuperAdmin = await User.findOne({ email: 'superadmin@megaartsstore.com' });
    const existingAdmin = await User.findOne({ email: 'admin@megaartsstore.com' });
    const existingUser = await User.findOne({ email: 'user@megaartsstore.com' });

    // Create Super Admin
    if (!existingSuperAdmin) {
      const superAdmin = await User.create({
        name: 'Super Admin',
        email: 'superadmin@megaartsstore.com',
        password: 'SuperAdmin@123',
        role: 'superadmin',
        isActive: true,
      });
      console.log('✅ Super Admin created:', superAdmin.email);
    } else {
      console.log('⚠️  Super Admin already exists');
    }

    // Create Admin
    if (!existingAdmin) {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@megaartsstore.com',
        password: 'Admin@123',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin created:', admin.email);
    } else {
      console.log('⚠️  Admin already exists');
    }

    // Create Regular User
    if (!existingUser) {
      const user = await User.create({
        name: 'Test User',
        email: 'user@megaartsstore.com',
        password: 'User@123',
        role: 'user',
        isActive: true,
      });
      console.log('✅ Regular User created:', user.email);
    } else {
      console.log('⚠️  Regular User already exists');
    }

    console.log('\n🎉 Admin users setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Email: superadmin@megaartsstore.com');
    console.log('  Password: SuperAdmin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@megaartsstore.com');
    console.log('  Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Regular User:');
    console.log('  Email: user@megaartsstore.com');
    console.log('  Password: User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    process.exit(1);
  }
};

createAdminUsers();
