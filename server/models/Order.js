const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        customization: {
            threadColor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            threadType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            kundanType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            kundanShape: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
            kundanColor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomizationOption',
            },
        },
        image: String,
    }],
    shippingAddress: {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['razorpay', 'cod'],
            required: true,
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        shipping: {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    coupon: {
        code: String,
        discount: Number,
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
    }],
    trackingNumber: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `MAS${Date.now()}${count + 1}`;
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
