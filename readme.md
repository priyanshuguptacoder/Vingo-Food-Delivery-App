# 🍔 Vingo - Food Delivery Platform

<p align="center">
  <strong>A full-stack food delivery platform built with React, Node.js, Express and MongoDB.</strong>
</p>

<p align="center">
  Discover restaurants, browse food, place orders, manage restaurants, and complete deliveries with OTP verification.
</p>

<p align="center">
  🚀 <a href="https://vingo-food-delivery-app-1.onrender.com/">Live Frontend</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  ⚙️ <a href="https://vingo-food-delivery-app-gwsn.onrender.com/">Live Backend</a>
</p>

---

## 📖 About

**Vingo** is a full-stack food delivery application that provides a complete restaurant, ordering, payment, and delivery workflow.

The platform supports three roles:

- 👤 Customer
- 🏪 Restaurant Owner
- 🛵 Delivery Boy

Customers can discover restaurants using their location, browse food, search items, manage their cart, place orders and track deliveries.

Restaurant owners can manage their restaurant, food items and customer orders.

Delivery boys receive delivery assignments, accept orders and complete deliveries using OTP verification.

---

## ✨ Features

### 👤 Customer

- 🔐 Email & password authentication
- 🔑 Google authentication
- 📍 Location detection
- 🏙️ City-based restaurant discovery
- 🏪 Restaurant browsing
- 🍕 Food item browsing
- 🔎 Food search
- 🥗 Veg / Non-Veg filtering
- ⭐ Food ratings
- 🛒 Shopping cart
- ➕ Quantity management
- 💳 Razorpay online payments
- 📦 Order placement
- 📋 Order history
- 🚚 Order tracking
- 📍 Delivery location support

### 🏪 Restaurant Owner

- 🔐 Owner authentication
- 🏪 Create & manage restaurant
- 🖼️ Restaurant image upload
- 🍔 Add food items
- ✏️ Edit food items
- 🗑️ Delete food items
- 💰 Manage prices
- 🥗 Veg / Non-Veg classification
- ⭐ Food ratings
- 📦 Receive orders
- 🔄 Update order status
- 🚚 Move orders to "Out for Delivery"
- 🛵 Delivery assignment

### 🛵 Delivery Boy

- 🔐 Delivery boy authentication
- 📡 Real-time delivery assignments
- 📍 Live location updates
- 📦 View delivery assignments
- ✅ Accept delivery orders
- 🧭 View restaurant/customer locations
- 📩 Request delivery OTP
- 🔢 Verify delivery OTP
- ✅ Mark order as delivered
- 📊 Completed deliveries
- 📈 Delivery statistics

---

## 🌍 Location-Based Restaurant System

Vingo uses the user's detected city to find restaurants.

### When restaurants exist

    User Location
          ↓
    City Detection
          ↓
       MongoDB
          ↓
    City Restaurants Found
          ↓
    Show City Restaurants

### When restaurants do not exist

    User Location
          ↓
    City Detection
          ↓
       MongoDB
          ↓
    No Restaurants Found
          ↓
    Default / Demo Restaurants
          ↓
    Show Recommended Restaurants

This fallback prevents the application from showing an empty restaurant and food section for unsupported cities.

---

## 🔄 Order & Delivery Workflow

    Customer
       ↓
    Place Order
       ↓
    Restaurant Owner
       ↓
    Accept / Prepare Order
       ↓
    Out for Delivery
       ↓
    Delivery Assignment Created
       ↓
    Delivery Boy Receives Assignment
       ↓
    Accept Order
       ↓
    Assignment = assigned
       ↓
    Mark As Delivered
       ↓
    Generate Delivery OTP
       ↓
    Send OTP to Customer
       ↓
    Delivery Boy Enters OTP
       ↓
    OTP Verified
       ↓
    Shop Order = delivered
       ↓
    Delivery Assignment = completed

---

## 📧 OTP System

The delivery verification system works like this:

    Generate OTP
         ↓
    Save OTP in MongoDB
         ↓
    Set expiration time
         ↓
    Send OTP using Brevo
         ↓
    Customer receives OTP
         ↓
    Delivery Boy enters OTP
         ↓
    Verify OTP
         ↓
    Order Delivered

The project uses the **Brevo HTTP API** for transactional email delivery.

---

# 🧱 Tech Stack

## Frontend

- React
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS
- React Icons
- Leaflet
- React Leaflet
- Recharts
- Socket.IO Client
- Firebase Authentication

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- Cloudinary
- Razorpay
- Axios
- Multer

## External Services

- 🍃 MongoDB Atlas
- 🔥 Firebase Authentication
- ☁️ Cloudinary
- 💳 Razorpay
- 📧 Brevo
- 🗺️ Geoapify
- 🔌 Socket.IO

---

# 🏗️ Architecture

                         ┌──────────────────────┐
                         │    Vingo Frontend    │
                         │     React + Vite     │
                         └───────────┬──────────┘
                                     │
                              Axios / Socket.IO
                                     │
                                     ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │       Node.js        │
                         └───────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       MongoDB Atlas             Cloudinary               Brevo
         Database                 Images                 Emails
              │
              ├── Users
              ├── Shops
              ├── Items
              ├── Orders
              └── Delivery Assignments

    Firebase  → Google Authentication
    Razorpay  → Online Payments
    Geoapify  → Location / Reverse Geocoding
    Socket.IO → Real-Time Communication

---

# 📁 Project Structure

Vingo-Food-Delivery-App/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── item.controllers.js
│   │   ├── order.controllers.js
│   │   ├── shop.controllers.js
│   │   └── user.controllers.js
│   │
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   │
│   ├── models/
│   │   ├── deliveryAssignment.model.js
│   │   ├── item.model.js
│   │   ├── order.model.js
│   │   ├── shop.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── item.routes.js
│   │   ├── order.routes.js
│   │   ├── shop.routes.js
│   │   └── user.routes.js
│   │
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── mail.js
│   │
│   ├── index.js
│   ├── socket.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── firebase.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md

---

# 🔌 API Endpoints

## Authentication

    POST   /api/auth/signup
    POST   /api/auth/signin
    POST   /api/auth/logout
    POST   /api/auth/send-otp
    POST   /api/auth/verify-otp
    POST   /api/auth/reset-password

## Shops

    POST   /api/shop/create-edit
    GET    /api/shop/get-my
    GET    /api/shop/get-by-city/:city

## Food Items

    POST   /api/item/add-item
    POST   /api/item/edit-item/:itemId
    GET    /api/item/get-by-id/:itemId
    GET    /api/item/delete/:itemId
    GET    /api/item/get-by-city/:city
    GET    /api/item/get-by-shop/:shopId
    GET    /api/item/search-items
    POST   /api/item/rating

## Orders

    POST   /api/order/place-order
    POST   /api/order/verify-payment
    GET    /api/order/my-orders
    PUT    /api/order/update-status/:orderId/:shopId
    GET    /api/order/delivery-boy-assignment
    POST   /api/order/accept-order/:assignmentId
    GET    /api/order/current-order
    GET    /api/order/get-order-by-id/:orderId
    POST   /api/order/send-delivery-otp
    POST   /api/order/verify-delivery-otp
    GET    /api/order/today-deliveries

---

# 🗄️ Database Models

## User

Stores:

- Full name
- Email
- Password
- Mobile
- Role
- Location
- OTP information
- Socket ID

Supported roles:

    user
    owner
    deliveryBoy

## Shop

Stores:

- Restaurant name
- Restaurant image
- Owner
- City
- State
- Address
- Food items
- Default/demo flag

Example:

    {
      "name": "Vingo Pizza House",
      "city": "Jalandhar",
      "state": "Punjab",
      "isDefault": false
    }

Fallback restaurant:

    {
      "name": "Vingo Kitchen",
      "city": "Vingo Demo",
      "state": "Demo",
      "isDefault": true
    }

## Item

Stores:

- Food name
- Food image
- Restaurant
- Category
- Price
- Food type
- Rating

Supported categories:

    Snacks
    Main Course
    Desserts
    Pizza
    Burgers
    Sandwiches
    South Indian
    North Indian
    Chinese
    Fast Food
    Others

Food types:

    veg
    non veg

---

# 🛒 Cart Flow

    Browse Restaurant
          ↓
      Select Food
          ↓
       Add Cart
          ↓
    Update Quantity
          ↓
      Review Cart
          ↓
        Checkout
          ↓
      Select Payment
          ↓
       Place Order

---

# 💳 Payment Flow

    Customer
        ↓
    Place Order
        ↓
    Backend creates Razorpay Order
        ↓
    Razorpay Checkout
        ↓
    Payment Completed
        ↓
    Backend verifies Payment
        ↓
    Order marked as Paid
        ↓
    Restaurant receives Order

---

# 📍 Location Flow

    Browser Location
          ↓
    Latitude + Longitude
          ↓
    Reverse Geocoding
          ↓
          City
          ↓
    Restaurant Search
          ↓
        MongoDB

If restaurants exist in the detected city, city-specific restaurants are shown.

If no restaurants exist, default demo restaurants are shown.

---

# 🔌 Real-Time Communication

Socket.IO is used for real-time updates.

Examples:

    newOrder
    newAssignment
    order status updates
    delivery location updates

This allows restaurant owners and delivery boys to receive updates without refreshing the application.

---

# 🔐 Authentication

## Traditional Authentication

    Email
    Password
    JWT

## Google Authentication

    Firebase
       ↓
    Google Login
       ↓
    Vingo User Session

---

# ☁️ Image Management

Restaurant and food images can be stored using Cloudinary.

    Frontend
       ↓
    Image Upload
       ↓
    Multer
       ↓
    Cloudinary
       ↓
    Image URL
       ↓
    MongoDB

Demo and fallback data can also use generated SVG data URLs.

---

# ⚙️ Environment Variables

## Backend

Create:

    PORT=8000

    MONGODB_URL=your_mongodb_connection_string

    JWT_SECRET=your_jwt_secret

    EMAIL=your_verified_sender_email

    BREVO_API_KEY=your_brevo_api_key

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

    CLOUDINARY_API_KEY=your_cloudinary_api_key

    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    RAZORPAY_KEY_ID=your_razorpay_key_id

    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

## Frontend

Create:

    VITE_FIREBASE_APIKEY=your_firebase_api_key

    VITE_GEOAPIKEY=your_geoapify_api_key

### ⚠️ Security

Never commit:

    .env
    API keys
    MongoDB passwords
    JWT secrets
    Cloudinary secrets
    Brevo API keys
    Razorpay secret keys
    Firebase private credentials

Use environment variables locally and in Render.

---

# 🚀 Run Locally

## Clone

    git clone https://github.com/priyanshuguptacoder/Vingo-Food-Delivery-App.git

    cd Vingo-Food-Delivery-App

## Backend

    cd backend

    npm install

    npm run dev

Backend runs on:

    http://localhost:8000

## Frontend

Open another terminal:

    cd frontend

    npm install

    npm run dev

Vite will provide the local frontend URL.

---

# ☁️ Deployment

### Frontend

https://vingo-food-delivery-app-1.onrender.com/

### Backend

https://vingo-food-delivery-app-gwsn.onrender.com/

The project is deployed using Render.

---

# 🧪 Complete Delivery Test

    1. Customer signs in
           ↓
    2. Customer places order
           ↓
    3. Owner receives order
           ↓
    4. Owner updates order
           ↓
    5. Owner marks "Out for Delivery"
           ↓
    6. Delivery assignment created
           ↓
    7. Delivery Boy receives assignment
           ↓
    8. Delivery Boy accepts order
           ↓
    9. Delivery Boy clicks "Mark As Delivered"
           ↓
    10. OTP generated
           ↓
    11. OTP sent to customer
           ↓
    12. Delivery Boy enters OTP
           ↓
    13. OTP verified
           ↓
    14. Shop Order = delivered
           ↓
    15. Delivery Assignment = completed

---

# 🎯 Engineering Highlights

This project demonstrates:

- REST API development
- JWT authentication
- Role-based authorization
- Firebase authentication
- MongoDB & Mongoose relationships
- React component architecture
- Redux Toolkit
- Axios API integration
- Socket.IO real-time communication
- Razorpay payment integration
- Cloudinary image management
- Transactional email API
- Location-based restaurant discovery
- City-based filtering
- Default restaurant fallback
- OTP-based delivery verification
- Order state management
- Delivery assignment management
- Production deployment with Render

---

# 🚧 Future Improvements

- 📍 Real nearby restaurant discovery
- 🗺️ Live delivery tracking
- 🛵 Delivery route optimization
- 🔔 Push notifications
- 🎟️ Coupon and discount system
- 🧾 Invoice generation
- 📊 Restaurant analytics
- 💰 Delivery partner earnings
- 🛡️ Admin dashboard
- 🔄 Order cancellation and refund workflow
- 🤖 Personalized food recommendations
- ⚡ API caching
- 📄 Pagination
- 🧪 Automated testing
- 🔁 CI/CD pipeline

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

