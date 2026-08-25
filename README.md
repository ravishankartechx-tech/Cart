# 🍕 FeastRocket — Modern Food Delivery Platform

A full-stack food delivery web application built with React 19, TailwindCSS, Express 5, MongoDB / Mongoose, and Socket.io.

---

## 🚀 Quick Start (One-Command Startup)

Install dependencies across workspaces:
```bash
npm install
```

Start **both Backend (Port 5001) and Frontend (Port 5173)** concurrently:
```bash
npm run dev
```

Visit the app in your browser: **[http://localhost:5173](http://localhost:5173)**

---

## 🗄️ Database Seeding

To populate MongoDB with rich sample data (9 restaurants with full menus, test accounts for all roles, coupons, and orders):

```bash
npm run seed
```

---

## 🔑 Demo Test Accounts

The login page provides **1-click login buttons** for all 4 roles:

| Role | Email | Password | Dashboard Link |
|---|---|---|---|
| **Customer** | `user@feastrocket.com` | `user123` | `/orders` & `/profile` |
| **Restaurant Owner** | `restaurant@feastrocket.com` | `resto123` | `/restaurant-dashboard` |
| **Delivery Partner** | `delivery@feastrocket.com` | `delivery123` | `/delivery` |
| **Platform Admin** | `admin@feastrocket.com` | `admin123` | `/admin` |

---

## 📁 Project Structure

```
food-delivery-app/
├── backend/                  # Node.js Express REST API & Socket.io
│   ├── middleware/           # Auth, Role, Rate Limiter
│   ├── models/               # Mongoose Schemas (User, Restaurant, Order, Menu, Coupon, etc.)
│   ├── routes/               # API Endpoints
│   ├── seed.js               # Database Seeder Script
│   ├── server.js             # Server Entry Point (Port 5001)
│   └── .env                  # Backend configuration
├── frontend/                 # Vite + React 19 Application
│   ├── src/
│   │   ├── api/client.js     # Centralized Axios API client
│   │   ├── components/       # UI Components (Navbar, FilterBar, Stepper, etc.)
│   │   ├── context/          # AuthContext, CartContext, ThemeContext
│   │   └── pages/            # Page Views (Home, Listing, Detail, Tracking, Dashboards)
│   └── .env                  # Frontend configuration (VITE_API_URL=http://localhost:5001/api)
├── package.json              # Root npm workspaces config with concurrent runner
└── README.md
```

---

## 🛠️ Individual Workspace Scripts

- **Run Frontend Only**: `npm run dev:frontend`
- **Run Backend Only**: `npm run dev:backend`
- **Build Frontend Bundle**: `npm run build`
- **Seed Database**: `npm run seed`
