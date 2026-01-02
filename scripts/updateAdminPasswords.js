// Update admin password in production MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: String,
    isActive: Boolean,
    createdAt: Date
});

async function updateAdminPassword() {
    try {
        console.log('\n🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        const User = mongoose.model('User', userSchema);

        // Generate new password hash
        const newPassword = 'SuperAdmin@2026!';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update superadmin
        const superadmin = await User.findOneAndUpdate(
            { email: 'superadmin@megaartsstore.com' },
            { password: hashedPassword },
            { new: true }
        );

        if (superadmin) {
            console.log('✅ Updated superadmin password');
        } else {
            console.log('⚠️  Superadmin not found, creating new account...');
            await User.create({
                name: 'Super Admin',
                email: 'superadmin@megaartsstore.com',
                password: hashedPassword,
                role: 'superadmin',
                isActive: true,
                createdAt: new Date()
            });
            console.log('✅ Created new superadmin account');
        }

        // Update admin
        const admin = await User.findOneAndUpdate(
            { email: 'admin@megaartsstore.com' },
            { password: await bcrypt.hash('AdminUser@2026!', 10) },
            { new: true }
        );

        if (admin) {
            console.log('✅ Updated admin password');
        } else {
            console.log('⚠️  Admin not found, creating new account...');
            await User.create({
                name: 'Admin User',
                email: 'admin@megaartsstore.com',
                password: await bcrypt.hash('AdminUser@2026!', 10),
                role: 'admin',
                isActive: true,
                createdAt: new Date()
            });
            console.log('✅ Created new admin account');
        }

        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║              ✅ PASSWORDS UPDATED SUCCESSFULLY              ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║                                                            ║');
        console.log('║  Login at:                                                 ║');
        console.log('║  https://megaartsstore-gh2aju3kj-chandans-projects-       ║');
        console.log('║  ad404f13.vercel.app/admin/login                           ║');
        console.log('║                                                            ║');
        console.log('║  Super Admin:                                              ║');
        console.log('║    Email: superadmin@megaartsstore.com                     ║');
        console.log('║    Password: SuperAdmin@2026!                              ║');
        console.log('║                                                            ║');
        console.log('║  Admin:                                                    ║');
        console.log('║    Email: admin@megaartsstore.com                          ║');
        console.log('║    Password: AdminUser@2026!                               ║');
        console.log('║                                                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateAdminPassword();
