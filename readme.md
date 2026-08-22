<div align="center">

# 🍔 Vingo

### A production-grade, full-stack food delivery platform

Real-time ordering, restaurant management, and OTP-verified deliveries — built on the MERN stack with Socket.IO, Razorpay, and Firebase.

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=flat&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#-license)

**[🚀 Live App](https://vingo-food-delivery-app-1.onrender.com/)** &nbsp;·&nbsp; **[⚙️ API](https://vingo-food-delivery-app-gwsn.onrender.com/)** &nbsp;·&nbsp; **[🐛 Report Bug](https://github.com/priyanshuguptacoder/Vingo-Food-Delivery-App/issues)**

</div>

<br>

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Core Workflows](#-core-workflows)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Models](#️-database-models)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [Deployment](#️-deployment)
- [Roadmap](#-roadmap)
- [Contributors](#-contributors)

<br>

## 📖 About

**Vingo** is a full-stack food delivery application modeled after real-world platforms like Zomato and Swiggy — covering the complete lifecycle from restaurant discovery to OTP-verified doorstep delivery.

It's built around **three roles that interact in real time**:

| Role | What they do |
|---|---|
| 👤 **Customer** | Discover nearby restaurants, browse & search food, pay online, and track orders live |
| 🏪 **Restaurant Owner** | Manage their storefront, menu, and incoming order pipeline |
| 🛵 **Delivery Boy** | Receive live assignments, navigate to pickup/drop, and confirm delivery via OTP |

What sets this apart from a typical CRUD project: **live Socket.IO updates**, **Razorpay payment verification**, **city-based discovery with automatic fallback**, and an **OTP-secured handoff** that mirrors how production delivery apps actually confirm drop-off.

<br>

## ✨ Features

<table>
<tr>
<td valign="top" width="33%">

### 👤 Customer
- Email/password + Google auth
- Auto location detection
- City-based restaurant discovery
- Search + veg/non-veg filters
- Ratings & reviews
- Cart with live quantity sync
- Razorpay checkout
- Order history & live tracking

</td>
<td valign="top" width="33%">

### 🏪 Restaurant Owner
- Owner authentication
- Storefront setup + image upload
- Full menu CRUD
- Price & category management
- Live incoming order feed
- Order status pipeline
- Delivery hand-off trigger

</td>
<td valign="top" width="33%">

### 🛵 Delivery Boy
- Delivery authentication
- Real-time assignment feed
- Live location broadcasting
- Accept / reject assignments
- Map view of pickup & drop
- OTP request & verification
- Delivery stats dashboard

</td>
</tr>
</table>

<br>

## 🧱 Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
```
React + Vite
React Router
Redux Toolkit
Axios
Tailwind CSS
Leaflet / React Leaflet
Recharts
Socket.IO Client
Firebase Auth
```

</td>
<td valign="top" width="33%">

**Backend**
```
Node.js + Express
MongoDB + Mongoose
JWT + bcryptjs
Socket.IO
Cloudinary
Razorpay
Multer
```

</td>
<td valign="top" width="33%">

**Infrastructure**
```
MongoDB Atlas
Firebase Auth
Cloudinary
Razorpay
Brevo (email)
Geoapify (geocoding)
Render (hosting)
```

</td>
</tr>
</table>

<br>

## 🏗️ Architecture

```
                     ┌────────────────────────┐
                     │      Vingo Frontend      │
                     │       React + Vite        │
                     └────────────┬─────────────┘
                                  │
                        Axios  +  Socket.IO
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │     Express Backend      │
                     │         Node.js           │
                     └────────────┬─────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                      │
            ▼                     ▼                      ▼
      MongoDB Atlas           Cloudinary                Brevo
       ─────────────           images                  emails
       Users
       Shops
       Items
       Orders
       Delivery Assignments

  Firebase   →  Google Authentication
  Razorpay   →  Payment processing + verification
  Geoapify   →  Reverse geocoding for city detection
  Socket.IO  →  Live order / assignment / location events
```

<br>

## 🔄 Core Workflows

<details open>
<summary><strong>🌍 Location-based restaurant discovery</strong></summary>

<br>

Vingo detects the user's city via reverse geocoding, then queries MongoDB. If no restaurants exist yet for that city, it falls back to curated demo restaurants instead of an empty screen — so the app never feels broken in a new market.

```
User Location → City Detection → MongoDB Lookup
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                      ▼
          City Restaurants Found                No Restaurants Found
                    │                                      │
          Show City Restaurants              Show Default / Demo Restaurants
```

</details>

<details>
<summary><strong>📦 Order → Delivery lifecycle</strong></summary>

<br>

```
Customer places order
   → Restaurant owner accepts & prepares
   → Owner marks "Out for Delivery"
   → Delivery assignment created
   → Nearby delivery boy notified in real time
   → Delivery boy accepts (assignment: assigned)
   → Delivery boy clicks "Mark As Delivered"
   → OTP generated & emailed to customer
   → Delivery boy enters OTP on handoff
   → OTP verified
   → Shop order → delivered
   → Delivery assignment → completed
```

</details>

<details>
<summary><strong>📧 OTP verification</strong></summary>

<br>

```
Generate OTP → Persist in MongoDB with expiry
   → Send via Brevo HTTP API → Customer receives OTP
   → Delivery boy enters OTP at drop-off
   → Backend verifies → Order marked delivered
```

</details>

<details>
<summary><strong>💳 Payment flow (Razorpay)</strong></summary>

<br>

```
Customer checks out → Backend creates Razorpay order
   → Razorpay checkout widget opens → Payment completed
   → Backend verifies payment signature
   → Order marked as paid → Restaurant notified in real time
```

</details>

<br>

## 📁 Project Structure

```
Vingo-Food-Delivery-App/
│
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── item.controllers.js
│   │   ├── order.controllers.js
│   │   ├── shop.controllers.js
│   │   └── user.controllers.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── models/
│   │   ├── deliveryAssignment.model.js
│   │   ├── item.model.js
│   │   ├── order.model.js
│   │   ├── shop.model.js
│   │   └── user.model.js
│   ├── routes/            # auth · item · order · shop · user
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── mail.js
│   ├── index.js
│   └── socket.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── redux/
│       ├── App.jsx
│       ├── main.jsx
│       └── firebase.js
│
└── README.md
```

<br>

## 🔌 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/signin` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `POST` | `/api/auth/send-otp` | Send verification OTP |
| `POST` | `/api/auth/verify-otp` | Verify OTP |
| `POST` | `/api/auth/reset-password` | Reset password |

</details>

<details>
<summary><strong>🏪 Shops</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shop/create-edit` | Create or update a restaurant |
| `GET` | `/api/shop/get-my` | Get the logged-in owner's shop |
| `GET` | `/api/shop/get-by-city/:city` | Get shops in a city |

</details>

<details>
<summary><strong>🍔 Food Items</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/item/add-item` | Add a food item |
| `POST` | `/api/item/edit-item/:itemId` | Edit a food item |
| `GET` | `/api/item/get-by-id/:itemId` | Get item by ID |
| `GET` | `/api/item/delete/:itemId` | Delete an item |
| `GET` | `/api/item/get-by-city/:city` | Get items by city |
| `GET` | `/api/item/get-by-shop/:shopId` | Get items by shop |
| `GET` | `/api/item/search-items` | Search food items |
| `POST` | `/api/item/rating` | Rate a food item |

</details>

<details>
<summary><strong>📦 Orders</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/order/place-order` | Place a new order |
| `POST` | `/api/order/verify-payment` | Verify Razorpay payment |
| `GET` | `/api/order/my-orders` | Get customer's orders |
| `PUT` | `/api/order/update-status/:orderId/:shopId` | Update order status |
| `GET` | `/api/order/delivery-boy-assignment` | Get pending assignments |
| `POST` | `/api/order/accept-order/:assignmentId` | Accept a delivery |
| `GET` | `/api/order/current-order` | Get active order |
| `GET` | `/api/order/get-order-by-id/:orderId` | Get order details |
| `POST` | `/api/order/send-delivery-otp` | Send delivery OTP |
| `POST` | `/api/order/verify-delivery-otp` | Verify delivery OTP |
| `GET` | `/api/order/today-deliveries` | Get today's completed deliveries |

</details>

<br>

## 🗄️ Database Models

**User** — full name · email · password · mobile · role · location · OTP info · socket ID
Roles: `user` · `owner` · `deliveryBoy`

**Shop** — name · image · owner · city · state · address · food items · default/demo flag
```json
{ "name": "Vingo Pizza House", "city": "Jalandhar", "state": "Punjab", "isDefault": false }
```

**Item** — food name · image · restaurant · category · price · food type · rating
Categories: `Snacks` `Main Course` `Desserts` `Pizza` `Burgers` `Sandwiches` `South Indian` `North Indian` `Chinese` `Fast Food` `Others`
Type: `veg` · `non veg`

<br>

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas connection string
- API keys for Cloudinary, Razorpay, Brevo, Firebase, and Geoapify (see below)

### 1. Clone the repo
```bash
git clone https://github.com/priyanshuguptacoder/Vingo-Food-Delivery-App.git
cd Vingo-Food-Delivery-App
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values — see Environment Variables below
npm run dev
```
Runs at `http://localhost:8000`

### 3. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Vite will print your local dev URL in the terminal.

<br>

## ⚙️ Environment Variables

**`backend/.env`**
```env
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
```

**`frontend/.env`**
```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_GEOAPIKEY=your_geoapify_api_key
```

> ⚠️ **Never commit `.env` files or secrets.** Keep API keys, database credentials, and JWT secrets out of version control — set them as environment variables locally and in your deployment platform (e.g. Render's dashboard).

<br>

## ☁️ Deployment

| Service | URL |
|---|---|
| 🚀 Frontend | [vingo-food-delivery-app-1.onrender.com](https://vingo-food-delivery-app-1.onrender.com/) |
| ⚙️ Backend | [vingo-food-delivery-app-gwsn.onrender.com](https://vingo-food-delivery-app-gwsn.onrender.com/) |

Both services are deployed on **Render**, with environment variables managed via the Render dashboard.

<br>

## 🎯 Engineering Highlights

- REST API design with clear controller/route separation
- JWT authentication with role-based authorization (`user` / `owner` / `deliveryBoy`)
- Firebase-backed Google OAuth alongside traditional auth
- MongoDB/Mongoose schema relationships across users, shops, items, and orders
- Real-time updates via Socket.IO (orders, assignments, location)
- Razorpay integration with server-side payment verification
- Cloudinary-backed image pipeline via Multer
- Transactional email delivery via Brevo's HTTP API
- Location-aware discovery with a graceful demo-data fallback
- OTP-secured delivery confirmation flow
- Deployed and running in production on Render

<br>

## 🚧 Roadmap

- [ ] 📍 True nearby-restaurant discovery (radius search)
- [ ] 🗺️ Live delivery tracking on a map
- [ ] 🛵 Delivery route optimization
- [ ] 🔔 Push notifications
- [ ] 🎟️ Coupons & discounts
- [ ] 🧾 Invoice generation
- [ ] 📊 Restaurant analytics dashboard
- [ ] 💰 Delivery partner earnings tracking
- [ ] 🛡️ Admin dashboard
- [ ] 🔄 Order cancellation & refunds
- [ ] 🤖 Personalized recommendations
- [ ] ⚡ API caching + pagination
- [ ] 🧪 Automated test suite
- [ ] 🔁 CI/CD pipeline

<br>

## 🤝 Contributing

Contributions are welcome. To propose a change:

```bash
1. Fork the repository
2. Create a feature branch    → git checkout -b feature/your-feature
3. Commit your changes        → git commit -m "Add your feature"
4. Push to your branch        → git push origin feature/your-feature
5. Open a Pull Request
```

<br>

## 📄 License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

<br>

<div align="center">

### ⭐ If you find Vingo useful, consider starring the repo — it genuinely helps!

</div>
