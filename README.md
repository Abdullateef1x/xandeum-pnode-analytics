🚀 Xandeum pNode Analytics Dashboard

A full-stack analytics dashboard for monitoring Xandeum pNodes, providing live network visibility, historical data tracking, and endpoint health analysis with persistent storage in MongoDB.

Built with Node.js, Express, Next.js, TypeScript, and Tailwind CSS.

🧠 Overview

This dashboard aggregates pNode data from multiple public pRPC endpoints, evaluates endpoint reliability, and stores historical snapshots for long-term analysis.
It is designed to be resilient, production-ready, and developer-friendly, with automatic fallbacks and clear separation between backend and frontend.

✨ Features

🌐 Fetch live pNode data from public pRPC endpoints

🗄️ Persist historical pNode snapshots in MongoDB

📊 Endpoint health scoring (success rate + latency tracking)

📋 Live and historical pNode tables with consistent dark mode UI

📈 Historical line-chart visualization using Recharts

⏱️ Auto-refresh live data every 15 seconds

⚠️ Automatic fallback to mock data if all endpoints fail

🌑 Full dark mode support

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js, TypeScript, Tailwind CSS, Recharts
Backend	Node.js, Express, TypeScript
Database	MongoDB
Styling	Tailwind CSS
Charts	Recharts
📋 Prerequisites

Node.js ≥ 18

npm ≥ 9

MongoDB (Atlas or local instance)

⚡ Quick Start (Local Development)

Run both backend and frontend concurrently for local testing or demos.

# From the project root
npm install
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"


Local URLs

Backend: http://localhost:4000

Frontend: http://localhost:3000

⚠️ Ensure your MongoDB URI is correctly configured before starting the backend.

🗂️ Environment Variables
Backend (backend/.env)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000


Replace placeholders with your MongoDB credentials

PORT is optional (defaults to 4000)

You may optionally include a .env.example for public reference

Frontend (Production Only)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com


This ensures the frontend points to the correct backend API in production.

🏗️ Backend

Location: backend/
Stack: Node.js + Express + TypeScript

API Endpoints
Route	Description
/api/pnodes/live	Fetches live pNode data from public endpoints
/api/pnodes/history	Returns historical pNode snapshots from MongoDB
Development
cd backend
npm install
npm run dev


Notes

Console logs are disabled in production via NODE_ENV !== 'production'

Historical snapshots are automatically seeded on first run

Endpoint health metrics are continuously recorded

💻 Frontend

Location: frontend/
Stack: Next.js + TypeScript + Tailwind CSS

Key Components
Component	Description
PNodeTable	Displays live or historical pNodes in a table
PNodeHistoryChart	Line-chart visualization of historical snapshots
LivePNodes	Client-side polling for live pNode data
HistoricalPNodesClient	Paginated and filtered historical view
Development
cd frontend
npm install
npm run dev


Notes

Live data auto-refreshes every 15 seconds

All console logs are disabled in production using process.env.NODE_ENV checks

🗄️ Database

MongoDB is used to persist historical snapshots and endpoint health metrics.

Collections
Collection	Purpose
pnodes	Stores each pNode snapshot with timestamp
endpointHealth	Stores endpoint latency and success metrics

Ensure your MONGO_URI is valid for both local and production environments.

🚀 Deployment
Backend Deployment

Set environment variables:

NODE_ENV=production
MONGO_URI=your_production_mongodb_uri


Start the backend:

cd backend
npm run start

Frontend Deployment

Set production API base URL:

NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com


Build and start:

cd frontend
npm run build
npm start


✅ All debug logs and development warnings are disabled in production.

⚡ Optional Enhancements

Status-based filtering (online / offline pNodes)

Cursor-based pagination for large historical datasets

Enhanced endpoint availability awareness and prioritization

📄 License

MIT © Kehinde Alao