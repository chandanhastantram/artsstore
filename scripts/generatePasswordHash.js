// Test script to verify admin account and generate new password
const bcrypt = require('bcryptjs');

async function testPassword() {
    const password = 'SuperAdmin@2026!';
    
    console.log('\n=== Password Hash Generator ===\n');
    
    // Generate new hash
    const newHash = await bcrypt.hash(password, 10);
    console.log('Password:', password);
    console.log('\nNew Hash to use in MongoDB:');
    console.log(newHash);
    
    console.log('\n=== Instructions ===');
    console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Browse Collections → megaartsstore → users');
    console.log('3. Find: superadmin@megaartsstore.com');
    console.log('4. Click Edit (pencil icon)');
    console.log('5. Replace the "password" field with the hash above');
    console.log('6. Click Update');
    console.log('7. Try logging in again\n');
}

testPassword();
