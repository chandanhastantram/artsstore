const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Cart is stored in user session/local storage on frontend
// These routes are for wishlist management

// @route   POST /api/cart/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.wishlist.includes(req.params.productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist',
            });
        }

        user.wishlist.push(req.params.productId);
        await user.save();

        res.json({
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/cart/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== req.params.productId
        );
        await user.save();

        res.json({
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/cart/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');

        res.json({
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
