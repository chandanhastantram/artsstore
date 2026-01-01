const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Store Information
  storeName: {
    type: String,
    required: true,
    default: 'MegaArtsStore'
  },
  storeEmail: {
    type: String,
    required: true,
    default: 'contact@megaartsstore.com'
  },
  storePhone: {
    type: String,
    required: true,
    default: '+91 1234567890'
  },
  storeAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },

  // Business Hours
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },

  // Social Media
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },

  // Payment Gateway
  paymentGateway: {
    razorpayEnabled: { type: Boolean, default: false },
    razorpayKeyId: { type: String, default: '' }
  },

  // Shipping Settings
  shipping: {
    freeShippingThreshold: { type: Number, default: 0 },
    flatRate: { type: Number, default: 0 },
    zones: [{
      name: String,
      rate: Number,
      states: [String]
    }]
  },

  // Tax Configuration
  tax: {
    enabled: { type: Boolean, default: false },
    rate: { type: Number, default: 0 },
    gstNumber: { type: String, default: '' }
  },

  // Email Notifications
  emailNotifications: {
    orderConfirmation: { type: Boolean, default: true },
    orderShipped: { type: Boolean, default: true },
    orderDelivered: { type: Boolean, default: true },
    orderCancelled: { type: Boolean, default: true }
  },

  // Currency
  currency: {
    code: { type: String, default: 'INR' },
    symbol: { type: String, default: '₹' }
  },

  // Contact Page Settings
  contactPage: {
    heading: { type: String, default: 'Get in Touch' },
    subheading: { type: String, default: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.' },
    email: { type: String, default: 'contact@megaartsstore.com' },
    phone: { type: String, default: '+91 1234567890' },
    address: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    workingHours: { type: String, default: 'Monday - Saturday: 10:00 AM - 7:00 PM' }
  },

  // Maintenance Mode
  maintenanceMode: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'We are currently under maintenance. Please check back soon.' }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
