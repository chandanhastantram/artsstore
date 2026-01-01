const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['thread-color', 'thread-type', 'kundan-type', 'kundan-shape', 'kundan-color'],
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    value: {
        type: String,
        required: [true, 'Please provide a value'],
        trim: true,
    },
    hexCode: {
        type: String, // For colors
        trim: true,
    },
    image: {
        url: String,
        alt: String,
    },
    priceModifier: {
        type: Number,
        default: 0, // Additional cost for this option
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CustomizationOption', customizationOptionSchema);
