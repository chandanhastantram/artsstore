const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get store settings
// @access  Public (some fields) / Private (sensitive fields)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Public fields (for frontend display)
    const publicSettings = {
      storeName: settings.storeName,
      storeEmail: settings.storeEmail,
      storePhone: settings.storePhone,
      storeAddress: settings.storeAddress,
      businessHours: settings.businessHours,
      socialMedia: settings.socialMedia,
      currency: settings.currency,
      shipping: {
        freeShippingThreshold: settings.shipping.freeShippingThreshold,
        flatRate: settings.shipping.flatRate
      },
      tax: {
        enabled: settings.tax.enabled,
        rate: settings.tax.rate
      }
    };

    res.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// @route   GET /api/settings/admin
// @desc    Get all settings (including sensitive data)
// @access  Private/Admin
router.get('/admin', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// @route   PUT /api/settings
// @desc    Update store settings
// @access  Private/SuperAdmin
router.put('/', protect, authorize('superadmin'), async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    
    // Update fields
    const allowedFields = [
      'storeName',
      'storeEmail',
      'storePhone',
      'storeAddress',
      'businessHours',
      'socialMedia',
      'paymentGateway',
      'shipping',
      'tax',
      'emailNotifications',
      'currency',
      'maintenanceMode'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
});

// @route   POST /api/settings/reset
// @desc    Reset settings to default
// @access  Private/SuperAdmin
router.post('/reset', protect, authorize('superadmin'), async (req, res) => {
  try {
    await Settings.deleteMany({});
    const settings = await Settings.create({});

    res.json({
      success: true,
      message: 'Settings reset to default',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
});

module.exports = router;
