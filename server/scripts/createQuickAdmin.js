const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createQuickAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@megaartsstore.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('\n📋 Admin Login Credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:    admin@megaartsstore.com');
      console.log('Password: MegaArts@2026');
      console.log('Role:     Super Admin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    }

    // Create Super Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@megaartsstore.com',
      password: 'MegaArts@2026', // Will be hashed by pre-save hook
      role: 'superadmin',
      isActive: true,
    });

    console.log('✅ Admin account created successfully!\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              Admin Login Credentials                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║ Email:    admin@megaartsstore.com                          ║');
    console.log('║ Password: MegaArts@2026                                    ║');
    console.log('║ Role:     Super Admin                                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   Login at: https://megaartsstore.vercel.app/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

createQuickAdmin();
