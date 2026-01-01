const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Private (Admin, SuperAdmin)
router.get('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/coupons/validate
// @desc    Validate coupon code
// @access  Public
router.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code',
            });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Coupon is expired or not valid',
            });
        }

        const discount = coupon.calculateDiscount(subtotal);

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/coupons
// @desc    Create coupon
// @access  Private (Admin, SuperAdmin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const coupon = await Coupon.create({
            ...req.body,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/coupons/:id
// @desc    Update coupon
// @access  Private (Admin, SuperAdmin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found',
            });
        }

        res.json({
            success: true,
            coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon
// @access  Private (Admin, SuperAdmin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found',
            });
        }

        res.json({
            success: true,
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
