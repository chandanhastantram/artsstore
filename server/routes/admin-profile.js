const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');

// Configure multer for profile photo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private (Admin, SuperAdmin)
router.get('/profile', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private (Admin, SuperAdmin)
router.put('/profile', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        
        await user.save();
        
        const updatedUser = await User.findById(user._id).select('-password');
        
        res.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/admin/profile/photo
// @desc    Upload profile photo
// @access  Private (Admin, SuperAdmin)
router.post('/profile/photo', protect, authorize('admin', 'superadmin'), upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file',
            });
        }
        
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        
        // Save file path
        user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
        await user.save();
        
        res.json({
            success: true,
            profilePhoto: user.profilePhoto,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/admin/2fa/setup
// @desc    Generate 2FA secret and QR code
// @access  Private (Admin, SuperAdmin)
router.post('/2fa/setup', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        
        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `MegaArtsStore (${user.email})`,
            length: 32,
        });
        
        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        
        // Save secret (temporarily, will be confirmed on verification)
        user.twoFactorSecret = secret.base32;
        await user.save();
        
        res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/admin/2fa/verify
// @desc    Verify and enable 2FA
// @access  Private (Admin, SuperAdmin)
router.post('/2fa/verify', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide verification token',
            });
        }
        
        const user = await User.findById(req.user.id).select('+twoFactorSecret');
        
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({
                success: false,
                message: 'Please setup 2FA first',
            });
        }
        
        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2,
        });
        
        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
            });
        }
        
        // Enable 2FA
        user.twoFactorEnabled = true;
        await user.save();
        
        res.json({
            success: true,
            message: '2FA enabled successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/admin/2fa/disable
// @desc    Disable 2FA
// @access  Private (Admin, SuperAdmin)
router.post('/2fa/disable', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide verification token',
            });
        }
        
        const user = await User.findById(req.user.id).select('+twoFactorSecret');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        
        if (!user.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: '2FA is not enabled',
            });
        }
        
        // Verify token before disabling
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2,
        });
        
        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
            });
        }
        
        // Disable 2FA
        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();
        
        res.json({
            success: true,
            message: '2FA disabled successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/admin/2fa/validate
// @desc    Validate 2FA token during login
// @access  Public (used during login)
router.post('/2fa/validate', async (req, res) => {
    try {
        const { userId, token } = req.body;
        
        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide user ID and token',
            });
        }
        
        const user = await User.findById(userId).select('+twoFactorSecret');
        
        if (!user || !user.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request',
            });
        }
        
        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2,
        });
        
        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
            });
        }
        
        res.json({
            success: true,
            message: '2FA validated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
