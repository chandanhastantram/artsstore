import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'MegaArtsStore'
  },
  storeEmail: {
    type: String,
    default: 'info@megaartsstore.com'
  },
  storePhone: {
    type: String,
    default: '+91 98765 43210'
  },
  storeAddress: {
    street: {
      type: String,
      default: '123 Heritage Lane'
    },
    city: {
      type: String,
      default: 'Jaipur'
    },
    state: {
      type: String,
      default: 'Rajasthan'
    },
    zip: {
      type: String,
      default: '302001'
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  // Logo and Branding
  branding: {
    logo: {
      type: String,
      default: ''
    },
    logoPublicId: {
      type: String,
      default: ''
    },
    favicon: {
      type: String,
      default: ''
    },
    faviconPublicId: {
      type: String,
      default: ''
    }
  },
  // Theme Customization
  theme: {
    primaryColor: {
      type: String,
      default: '#D4AF37' // Gold
    },
    secondaryColor: {
      type: String,
      default: '#8B0000' // Maroon
    },
    accentColor: {
      type: String,
      default: '#FFF8DC' // Ivory
    },
    fontFamily: {
      type: String,
      default: 'Inter, sans-serif'
    }
  },
  // Homepage Banner
  banner: {
    enabled: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Exquisite Kundan Bangles'
    },
    subtitle: {
      type: String,
      default: 'Handcrafted with Love & Tradition'
    },
    image: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Shop Now'
    },
    buttonLink: {
      type: String,
      default: '/shop'
    }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    whatsapp: String,
    youtube: String
  },
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 2000
    },
    flatRate: {
      type: Number,
      default: 100
    }
  },
  tax: {
    enabled: {
      type: Boolean,
      default: true
    },
    rate: {
      type: Number,
      default: 18
    },
    gstNumber: String
  },
  currency: {
    code: {
      type: String,
      default: 'INR'
    },
    symbol: {
      type: String,
      default: '₹'
    }
  },
  contactPage: {
    heading: {
      type: String,
      default: 'Get in Touch'
    },
    subheading: {
      type: String,
      default: 'We\'d love to hear from you'
    },
    email: String,
    phone: String,
    address: String,
    mapEmbedUrl: String,
    workingHours: {
      type: String,
      default: 'Monday - Saturday: 10:00 AM - 7:00 PM'
    }
  },
  // SEO Settings
  seo: {
    metaTitle: {
      type: String,
      default: 'MegaArtsStore - Handcrafted Kundan Bangles'
    },
    metaDescription: {
      type: String,
      default: 'Discover exquisite handcrafted Kundan bangles and traditional Indian jewelry'
    },
    metaKeywords: {
      type: String,
      default: 'kundan bangles, handcrafted jewelry, indian jewelry'
    }
  },
  // Business Hours
  businessHours: {
    monday: { type: String, default: '10:00 AM - 7:00 PM' },
    tuesday: { type: String, default: '10:00 AM - 7:00 PM' },
    wednesday: { type: String, default: '10:00 AM - 7:00 PM' },
    thursday: { type: String, default: '10:00 AM - 7:00 PM' },
    friday: { type: String, default: '10:00 AM - 7:00 PM' },
    saturday: { type: String, default: '10:00 AM - 7:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  // Homepage Configuration
  homepage: {
    // Hero Carousel Slides
    heroSlides: [{
      image: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      buttonText: { type: String, default: 'Shop Now' },
      buttonLink: { type: String, default: '/shop' },
      order: { type: Number, default: 0 }
    }],
    // Featured Products Section
    featuredSection: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'Featured Collection' },
      subtitle: { type: String, default: 'Handpicked pieces showcasing our finest craftsmanship' },
      displayCount: { type: Number, default: 6 },
      autoPlay: { type: Boolean, default: true },
      autoPlaySpeed: { type: Number, default: 3000 }
    },
    // Feature Cards
    features: [{
      icon: { type: String, default: 'Award' },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }],
    // Artisan Story Section
    artisanStory: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'Heritage of Craftsmanship' },
      highlightedText: { type: String, default: 'Craftsmanship' },
      content: { type: String, default: 'Each piece at MegaArtsStore is a testament to centuries-old traditions passed down through generations of master artisans.' },
      additionalContent: { type: String, default: 'We work directly with artisan families in Rajasthan, ensuring fair wages and preserving this invaluable cultural heritage.' },
      buttonText: { type: String, default: 'Learn More About Us' },
      buttonLink: { type: String, default: '/about' },
      image: { type: String, default: '' },
      imagePublicId: { type: String, default: '' }
    },
    // Testimonials
    testimonials: [{
      name: { type: String, default: '' },
      rating: { type: Number, default: 5 },
      comment: { type: String, default: '' },
      image: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }],
    // CTA Section
    ctaSection: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'Ready to Find Your Perfect Piece?' },
      subtitle: { type: String, default: 'Explore our collection and create something uniquely yours' },
      buttonText: { type: String, default: 'Start Shopping' },
      buttonLink: { type: String, default: '/shop' }
    }
  }
}, {
  timestamps: true
});

// Static method to get or create settings
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
