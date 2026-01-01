const express = require('express');
const router = express.Router();

// Newsletter model (simple in-memory for now, should use MongoDB in production)
const newsletters = [];

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }
        
        // Check if already subscribed
        if (newsletters.includes(email.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed',
            });
        }
        
        // Add to newsletter list
        newsletters.push(email.toLowerCase());
        
        // TODO: Send welcome email
        // await sendWelcomeEmail(email);
        
        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all subscribers (admin only)
// @access  Private (Admin)
router.get('/subscribers', async (req, res) => {
    try {
        res.json({
            success: true,
            count: newsletters.length,
            subscribers: newsletters,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
