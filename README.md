# FeastAI - Food Delivery Platform Setup Guide

## Step 1: Environment Setup
1. Open a terminal in the `backend` folder.
2. Ensure you have the `.env` file created (refer to `.env.example` below if missing).
3. Run `npm install`
4. Run `npm run dev` (Ensure you added a nodemon start script, e.g., `"dev": "nodemon server.js"` in `package.json`).

## Step 2: Running the Frontend
1. Open a new terminal in the `frontend` folder.
2. Run `npm install`
3. Run `npm run dev`
4. Open the link provided by Vite (usually `http://localhost:5173`).

## Environment Variables (.env)
Place this file inside `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=supersecretjwtkey123
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_placeholder
```

## Sample Data insertion logic (Coming soon)
We will provide a generic seeder script to populate Mongo with mock data once API is fully hooked.
