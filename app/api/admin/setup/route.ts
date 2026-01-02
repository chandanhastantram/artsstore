import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// This is a one-time setup route to create admin accounts
// It should be disabled or protected after initial setup

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const mongoose = require('mongoose');
        const body = await request.json();
        const { name, email, password, role, setupKey } = body;

        // Security: Require a setup key (set in environment variables)
        const validSetupKey = process.env.ADMIN_SETUP_KEY || 'megaartsstore-setup-2026';
        if (setupKey !== validSetupKey) {
            return NextResponse.json(
                { success: false, message: 'Invalid setup key' },
                { status: 403 }
            );
        }

        // Validate inputs
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (!['admin', 'superadmin'].includes(role)) {
            return NextResponse.json(
                { success: false, message: 'Role must be admin or superadmin' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const User = mongoose.models.User || require('@/app/models/User.js');
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const admin = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            message: `${role === 'superadmin' ? 'Super Admin' : 'Admin'} account created successfully!`,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error: any) {
        console.error('Admin setup error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
