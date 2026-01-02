// Direct MongoDB Admin Account Creator for Production
// Run: node scripts/createAdminsDirectly.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// IMPORTANT: Replace this with your actual production MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_PRODUCTION_MONGODB_URI_HERE';

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    phone: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const admins = [
    {
        name: 'Super Admin',
        email: 'superadmin@megaartsstore.com',
        password: 'SuperAdmin@2026!',
        role: 'superadmin'
    },
    {
        name: 'Admin User',
        email: 'admin@megaartsstore.com',
        password: 'AdminUser@2026!',
        role: 'admin'
    }
];

async function createAdmins() {
    try {
        console.log('\n🔌 Connecting to production MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        const User = mongoose.model('User', userSchema);

        for (const admin of admins) {
            // Check if already exists
            const existing = await User.findOne({ email: admin.email });
            if (existing) {
                console.log(`⚠️  ${admin.email} already exists - skipping`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(admin.password, salt);

            // Create user
            await User.create({
                ...admin,
                password: hashedPassword
            });

            console.log(`✅ Created ${admin.role}: ${admin.email}`);
        }

        console.log('\n╔════════════════════════════════════════════════════════════════╗');
        console.log('║                  ADMIN LOGIN CREDENTIALS                       ║');
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║                                                                ║');
        console.log('║  🔐 SUPER ADMIN:                                               ║');
        console.log('║     Email:    superadmin@megaartsstore.com                     ║');
        console.log('║     Password: SuperAdmin@2026!                                  ║');
        console.log('║                                                                ║');
        console.log('║  🔐 ADMIN:                                                     ║');
        console.log('║     Email:    admin@megaartsstore.com                          ║');
        console.log('║     Password: AdminUser@2026!                                   ║');
        console.log('║                                                                ║');
        console.log('║  Login URL:                                                    ║');
        console.log('║  https://megaartsstore-gh2aju3kj-chandans-projects-           ║');
        console.log('║  ad404f13.vercel.app/admin/login                               ║');
        console.log('║                                                                ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log('\n⚠️  IMPORTANT: Change these passwords after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmins();
