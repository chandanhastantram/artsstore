const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['bangles', 'necklaces', 'earrings', 'rings', 'bracelets'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    discountPrice: {
        type: Number,
        min: 0,
    },
    images: [{
        url: String,
        alt: String,
    }],
    model3D: {
        url: String,
        format: String, // glb, gltf
    },
    material: {
        type: String,
        trim: true,
    },
    careInstructions: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    isCustomizable: {
        type: Boolean,
        default: false,
    },
    customizationOptions: {
        threadColors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomizationOption',
        }],
        threadTypes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomizationOption',
        }],
        kundanTypes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomizationOption',
        }],
        kundanShapes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomizationOption',
        }],
        kundanColors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CustomizationOption',
        }],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
        distribution: {
            5: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            1: { type: Number, default: 0 },
        },
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    tags: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);
