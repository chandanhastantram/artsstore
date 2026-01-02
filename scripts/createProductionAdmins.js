// Create admin accounts in production
const https = require('https');

const VERCEL_URL = 'megaartsstore-gh2aju3kj-chandans-projects-ad404f13.vercel.app';

const admins = [
    {
        name: 'Super Admin',
        email: 'superadmin@megaartsstore.com',
        password: 'SuperAdmin@2026!',
        role: 'superadmin',
        setupKey: 'megaartsstore-setup-2026'
    },
    {
        name: 'Admin User',
        email: 'admin@megaartsstore.com',
        password: 'AdminUser@2026!',
        role: 'admin',
        setupKey: 'megaartsstore-setup-2026'
    }
];

function createAdmin(admin) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(admin);
        
        const options = {
            hostname: VERCEL_URL,
            path: '/api/admin/setup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve(result);
                } catch (e) {
                    resolve({ success: false, message: body });
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('\n🔐 Creating admin accounts in production...\n');

    for (const admin of admins) {
        try {
            const result = await createAdmin(admin);
            if (result.success) {
                console.log(`✅ Created ${admin.role}: ${admin.email}`);
            } else {
                console.log(`⚠️  ${admin.email}: ${result.message}`);
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              ADMIN LOGIN CREDENTIALS                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║                                                            ║');
    console.log('║  🔐 SUPER ADMIN:                                           ║');
    console.log('║     Email:    superadmin@megaartsstore.com                 ║');
    console.log('║     Password: SuperAdmin@2026!                             ║');
    console.log('║                                                            ║');
    console.log('║  🔐 ADMIN:                                                 ║');
    console.log('║     Email:    admin@megaartsstore.com                      ║');
    console.log('║     Password: AdminUser@2026!                              ║');
    console.log('║                                                            ║');
    console.log('║  Login: https://megaartsstore-gh2aju3kj-chandans-         ║');
    console.log('║         projects-ad404f13.vercel.app/admin/login           ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
}

main();
