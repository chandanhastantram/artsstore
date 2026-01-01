const express = require('express');
const router = express.Router();
const CustomizationOption = require('../models/CustomizationOption');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/customization
// @desc    Get all customization options
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;

        let query = { isActive: true };
        if (type) query.type = type;

        const options = await CustomizationOption.find(query);

        // Group by type
        const grouped = {
            threadColors: options.filter(opt => opt.type === 'thread-color'),
            threadTypes: options.filter(opt => opt.type === 'thread-type'),
            kundanTypes: options.filter(opt => opt.type === 'kundan-type'),
            kundanShapes: options.filter(opt => opt.type === 'kundan-shape'),
            kundanColors: options.filter(opt => opt.type === 'kundan-color'),
        };

        res.json({
            success: true,
            options: grouped,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   POST /api/customization
// @desc    Create customization option
// @access  Private (SuperAdmin only)
router.post('/', protect, authorize('superadmin'), async (req, res) => {
    try {
        const option = await CustomizationOption.create(req.body);

        res.status(201).json({
            success: true,
            option,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   PUT /api/customization/:id
// @desc    Update customization option
// @access  Private (SuperAdmin only)
router.put('/:id', protect, authorize('superadmin'), async (req, res) => {
    try {
        const option = await CustomizationOption.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!option) {
            return res.status(404).json({
                success: false,
                message: 'Customization option not found',
            });
        }

        res.json({
            success: true,
            option,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   DELETE /api/customization/:id
// @desc    Delete customization option
// @access  Private (SuperAdmin only)
router.delete('/:id', protect, authorize('superadmin'), async (req, res) => {
    try {
        const option = await CustomizationOption.findByIdAndDelete(req.params.id);

        if (!option) {
            return res.status(404).json({
                success: false,
                message: 'Customization option not found',
            });
        }

        res.json({
            success: true,
            message: 'Customization option deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
