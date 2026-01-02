const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../models/User');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Password strength validation
const validatePassword = (password) => {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long` };
  }
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
  }

  return { valid: true };
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Prompt user for input
const question = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Hide password input (basic implementation)
const questionPassword = async (query) => {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', function(char) {
      char = char.toString('utf8');
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          password = password.slice(0, -1);
          stdout.clearLine();
          stdout.cursorTo(0);
          stdout.write(query + '*'.repeat(password.length));
          break;
        default:
          password += char;
          stdout.write('*');
          break;
      }
    });
  });
};

const createSecureAdmin = async () => {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     MegaArtsStore - Secure Admin Account Creation         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin name
    const name = await question('👤 Enter admin name: ');
    if (!name || name.trim().length === 0) {
      console.log('❌ Name cannot be empty');
      process.exit(1);
    }

    // Get and validate email
    let email;
    while (true) {
      email = await question('📧 Enter admin email: ');
      if (!validateEmail(email)) {
        console.log('❌ Invalid email format. Please try again.\n');
        continue;
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ An account with this email already exists. Please use a different email.\n');
        continue;
      }

      break;
    }

    // Get and validate password
    let password;
    while (true) {
      console.log('\n📋 Password Requirements:');
      console.log('   • Minimum 12 characters');
      console.log('   • At least one uppercase letter');
      console.log('   • At least one lowercase letter');
      console.log('   • At least one number');
      console.log('   • At least one special character (!@#$%^&*...)\n');

      password = await questionPassword('🔒 Enter password: ');
      
      const validation = validatePassword(password);
      if (!validation.valid) {
        console.log(`❌ ${validation.message}\n`);
        continue;
      }

      const confirmPassword = await questionPassword('🔒 Confirm password: ');
      
      if (password !== confirmPassword) {
        console.log('❌ Passwords do not match. Please try again.\n');
        continue;
      }

      break;
    }

    // Select role
    console.log('\n👔 Select admin role:');
    console.log('   1. Super Admin (Full access to all features)');
    console.log('   2. Admin (Limited access - product & order management)');
    
    let role;
    while (true) {
      const roleChoice = await question('\nEnter choice (1 or 2): ');
      if (roleChoice === '1') {
        role = 'superadmin';
        break;
      } else if (roleChoice === '2') {
        role = 'admin';
        break;
      } else {
        console.log('❌ Invalid choice. Please enter 1 or 2.');
      }
    }

    // Confirm creation
    console.log('\n\n📝 Admin Account Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:  ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role:  ${role === 'superadmin' ? 'Super Admin' : 'Admin'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const confirm = await question('Create this admin account? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('\n❌ Admin creation cancelled.');
      process.exit(0);
    }

    // Create admin user
    console.log('\n⏳ Creating admin account...');
    
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by User model pre-save hook
      role,
      isActive: true,
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              Admin Login Credentials                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║ Email:    ${email.padEnd(48)} ║`);
    console.log(`║ Password: (as entered)${' '.repeat(32)} ║`);
    console.log(`║ Role:     ${(role === 'superadmin' ? 'Super Admin' : 'Admin').padEnd(48)} ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   You can now login at: /admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n❌ Admin creation cancelled.');
  process.exit(0);
});

createSecureAdmin();
