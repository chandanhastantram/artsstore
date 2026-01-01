const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, paymentInfo, pricing, coupon } = req.body;

        // Validate stock availability
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`,
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }
        }

        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentInfo,
            pricing,
            coupon,
            statusHistory: [{
                status: 'pending',
                note: 'Order created',
            }],
        });

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (admin) or user orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        // If not admin, only show user's orders
        if (req.user.role === 'user') {
            query.user = req.user.id;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product')
            .populate('items.customization.threadColor items.customization.threadType items.customization.kundanType items.customization.kundanShape items.customization.kundanColor');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check authorization
        if (req.user.role === 'user' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin, SuperAdmin)
router.put('/:id/status', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            note: note || `Status updated to ${status}`,
        });

        await order.save();

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
