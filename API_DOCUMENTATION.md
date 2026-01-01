# MegaArtsStore API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/auth/me`
- Requires authentication

### Update Profile
**PUT** `/auth/update-profile`
- Requires authentication

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543210",
  "address": {
    "street": "123 Main St",
    "city": "Jaipur",
    "state": "Rajasthan",
    "zipCode": "302001",
    "country": "India"
  }
}
```

### Logout
**POST** `/auth/logout`
- Requires authentication

---

## Product Endpoints

### Get All Products
**GET** `/products`

**Query Parameters:**
- `category`: Filter by category (kundan-bangles, handicrafts, art-decor, jewelry)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `material`: Filter by material
- `search`: Search in name, description, tags
- `featured`: true/false
- `sort`: newest, price-asc, price-desc, popular

**Example:**
```
GET /products?category=kundan-bangles&minPrice=1000&maxPrice=5000&sort=price-asc
```

### Get Single Product
**GET** `/products/:id`

### Create Product
**POST** `/products`
- Requires authentication (Admin/SuperAdmin)

**Body:**
```json
{
  "name": "Royal Kundan Bangle",
  "description": "Exquisite handcrafted bangle",
  "category": "kundan-bangles",
  "price": 5000,
  "discountPrice": 4500,
  "material": "Gold-plated brass with Kundan stones",
  "stock": 10,
  "isCustomizable": true,
  "featured": true,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Royal Kundan Bangle"
    }
  ]
}
```

### Update Product
**PUT** `/products/:id`
- Requires authentication (Admin/SuperAdmin)

### Delete Product
**DELETE** `/products/:id`
- Requires authentication (Admin/SuperAdmin)

### Add Product Review
**POST** `/products/:id/review`
- Requires authentication

**Body:**
```json
{
  "rating": 5,
  "comment": "Absolutely beautiful!"
}
```

---

## Customization Options Endpoints

### Get All Customization Options
**GET** `/customization`

**Query Parameters:**
- `type`: Filter by type (thread-color, thread-type, kundan-type, kundan-shape, kundan-color)

**Response:**
```json
{
  "success": true,
  "options": {
    "threadColors": [...],
    "threadTypes": [...],
    "kundanTypes": [...],
    "kundanShapes": [...],
    "kundanColors": [...]
  }
}
```

### Create Customization Option
**POST** `/customization`
- Requires authentication (SuperAdmin only)

**Body:**
```json
{
  "type": "thread-color",
  "name": "Royal Gold",
  "value": "royal-gold",
  "hexCode": "#D4AF37",
  "priceModifier": 0
}
```

### Update Customization Option
**PUT** `/customization/:id`
- Requires authentication (SuperAdmin only)

### Delete Customization Option
**DELETE** `/customization/:id`
- Requires authentication (SuperAdmin only)

---

## Order Endpoints

### Create Order
**POST** `/orders`
- Requires authentication

**Body:**
```json
{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "customization": {
        "threadColor": "option-id",
        "kundanColor": "option-id"
      }
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+919876543210",
    "street": "123 Main St",
    "city": "Jaipur",
    "state": "Rajasthan",
    "zipCode": "302001",
    "country": "India"
  },
  "paymentInfo": {
    "method": "razorpay",
    "razorpayOrderId": "order_id",
    "razorpayPaymentId": "payment_id",
    "razorpaySignature": "signature"
  },
  "pricing": {
    "subtotal": 10000,
    "discount": 500,
    "shipping": 100,
    "tax": 900,
    "total": 10500
  }
}
```

### Get All Orders
**GET** `/orders`
- Requires authentication
- Admins see all orders, users see only their orders

### Get Single Order
**GET** `/orders/:id`
- Requires authentication

### Update Order Status
**PUT** `/orders/:id/status`
- Requires authentication (Admin/SuperAdmin)

**Body:**
```json
{
  "status": "shipped",
  "note": "Order shipped via FedEx"
}
```

---

## Cart & Wishlist Endpoints

### Add to Wishlist
**POST** `/cart/wishlist/:productId`
- Requires authentication

### Remove from Wishlist
**DELETE** `/cart/wishlist/:productId`
- Requires authentication

### Get Wishlist
**GET** `/cart/wishlist`
- Requires authentication

---

## Payment Endpoints

### Create Razorpay Order
**POST** `/payment/create-order`
- Requires authentication

**Body:**
```json
{
  "amount": 10500,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "amount": 1050000,
    "currency": "INR"
  }
}
```

### Verify Payment
**POST** `/payment/verify`
- Requires authentication

**Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

---

## User Management Endpoints

### Get All Users
**GET** `/users`
- Requires authentication (SuperAdmin only)

### Update User Role
**PUT** `/users/:id/role`
- Requires authentication (SuperAdmin only)

**Body:**
```json
{
  "role": "admin"
}
```

### Update User Status
**PUT** `/users/:id/status`
- Requires authentication (SuperAdmin only)

**Body:**
```json
{
  "isActive": false
}
```

---

## Coupon Endpoints

### Get All Coupons
**GET** `/coupons`
- Requires authentication (Admin/SuperAdmin)

### Validate Coupon
**POST** `/coupons/validate`

**Body:**
```json
{
  "code": "WELCOME10",
  "subtotal": 5000
}
```

**Response:**
```json
{
  "success": true,
  "coupon": {
    "code": "WELCOME10",
    "description": "10% off on first order",
    "discount": 500
  }
}
```

### Create Coupon
**POST** `/coupons`
- Requires authentication (Admin/SuperAdmin)

**Body:**
```json
{
  "code": "WELCOME10",
  "description": "10% off on first order",
  "discountType": "percentage",
  "discountValue": 10,
  "minPurchase": 1000,
  "maxDiscount": 1000,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "usageLimit": 100
}
```

### Update Coupon
**PUT** `/coupons/:id`
- Requires authentication (Admin/SuperAdmin)

### Delete Coupon
**DELETE** `/coupons/:id`
- Requires authentication (Admin/SuperAdmin)

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 100 requests per 15 minutes per IP address

---

## Pagination

For endpoints returning lists, use these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example:**
```
GET /products?page=2&limit=20
```

---

For more information, contact: support@megaartsstore.com
