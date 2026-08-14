# FeastAI - Food Delivery Platform Setup Guide

## Step 1: Environment Setup

1. Open a terminal in the backend folder.
2. Ensure you have the .env file created.
3. Run npm install
4. Run npm run dev

## Step 2: Running the Frontend

1. Open a new terminal in the frontend folder.
2. Run npm install
3. Run npm run dev
4. Open http://localhost:5173

## Environment Variables (.env)

Place this file inside backend/.env

WARNING: Never use placeholder values in production. Generate a strong secret before deploying.

PORT=5000
MONGO_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=REPLACE_WITH_STRONG_RANDOM_SECRET_MIN_32_CHARS
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here

To generate a strong JWT secret run this command:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Sample Data

Seeder script coming soon.
