const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minPurchase: {
        type: Number,
        default: 0,
    },
    maxDiscount: {
        type: Number, // For percentage discounts
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: null, // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableCategories: [{
        type: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.validFrom &&
        now <= this.validUntil &&
        (this.usageLimit === null || this.usedCount < this.usageLimit)
    );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (subtotal) {
    if (!this.isValid() || subtotal < this.minPurchase) {
        return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (subtotal * this.discountValue) / 100;
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, subtotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
