import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const mongoose = require('mongoose');
        const bcrypt = require('bcryptjs');
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Get User model
        const User = mongoose.models.User || require('@/app/models/User.js');
        
        // Find user by email and include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { success: false, message: 'Account is deactivated' },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive
        };

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}
