# MegaArtsStore - Luxury E-Commerce Platform

A premium e-commerce platform for selling Kundan bangles, handcrafted jewelry, and traditional Indian handicrafts with advanced 3D visualization, AR try-on, and product customization features.

## 🌟 Features

### Customer Features

- **3D Product Visualization**: Interactive 3D bangle viewer with real-time customization
- **AR Try-On**: Virtual try-on using device camera
- **Product Customization**: Customize thread colors, kundan types, shapes, and colors
- **Advanced Filtering**: Filter products by category, price, material, and more
- **Shopping Cart & Wishlist**: Full e-commerce functionality
- **Secure Checkout**: Razorpay payment integration (UPI, Cards, Net Banking)
- **Order Tracking**: Track order status and history
- **Product Reviews**: Rate and review products

### Admin Features

- **Two Admin Roles**: Super Admin (full control) and Admin (limited access)
- **Product Management**: Add, edit, delete products with image uploads
- **Customization Options Management**: Manage thread and kundan options (Super Admin only)
- **Order Management**: View and update order status
- **User Management**: Manage users and admin roles (Super Admin only)
- **Coupon System**: Create and manage discount coupons
- **Analytics Dashboard**: Sales reports and statistics (Super Admin only)
- **CMS Control**: Manage homepage content and banners (Super Admin only)

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **State Management**: React Context API + Zustand
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **Email**: Nodemailer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd megaartsstore
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/megaartsstore

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=MegaArtsStore <noreply@megaartsstore.com>

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp
WHATSAPP_PHONE=+919876543210
```

### 4. Start MongoDB

If using local MongoDB:

```bash
mongod
```

If using MongoDB Atlas, ensure your connection string is correct in `.env`.

### 5. Run the Application

**Development Mode:**

Terminal 1 - Backend:

```bash
cd server
npm run dev
```

Terminal 2 - Frontend:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Production Build:**

```bash
npm run build
npm start
```

## 👤 Default Admin Credentials

See `ADMIN_CREDENTIALS.md` for demo admin accounts.

## 📚 Project Structure

```
megaartsstore/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── shop/                # Shop page
│   ├── product/[id]/        # Product detail page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout page
│   ├── admin/               # Admin panel
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── layout/              # Layout components
│   ├── 3d/                  # 3D viewer components
│   ├── ar/                  # AR try-on components
│   └── customization/       # Customization panel
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Authentication
│   └── CartContext.tsx      # Shopping cart
├── lib/                     # Utility functions
│   └── api.ts              # API client
├── server/                  # Backend server
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── index.js            # Server entry point
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies
```

## 🎨 Design System

### Color Palette

- **Ivory**: #FAF9F6 (Base)
- **Gold**: #D4AF37 (Primary accent)
- **Maroon**: #800020 (Secondary accent)
- **Emerald**: #50C878 (Highlights)

### Typography

- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation
- XSS protection

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📦 Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy to Vercel
```

### Backend (Heroku/Railway/DigitalOcean)

```bash
cd server
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support, email support@megaartsstore.com or join our WhatsApp support channel.

## 🙏 Acknowledgments

- Master artisans of Rajasthan for their craftsmanship
- The open-source community for amazing tools and libraries
- Our customers for their continued support

---

**Built with ❤️ for preserving Indian heritage craftsmanship**
