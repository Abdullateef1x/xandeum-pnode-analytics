🚀 Xandeum pNode Analytics Dashboard

A full-stack analytics dashboard for monitoring Xandeum pNodes.
The platform provides live network visibility, historical snapshots, endpoint health monitoring, and persistent storage using MongoDB.

Built with Node.js, Express, Next.js, TypeScript, and Tailwind CSS.

✨ Features

🌐 Fetches live pNode data from public pRPC endpoints

🗄️ Stores historical pNode snapshots in MongoDB (1 snapshot per minute)

📊 Endpoint health scoring based on success rate and latency

📋 Live and historical tables with consistent fixed-column layout

📈 Time-series line chart for historical pNode counts (Recharts)

⏱️ Automatic refresh of live data every 15 seconds

⚠️ Graceful fallback to mock data if all endpoints fail

🌑 Dark mode UI optimized for monitoring dashboards

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js, TypeScript, Tailwind CSS, Recharts
Backend	Node.js, Express, TypeScript
Database	MongoDB
Scheduling	node-cron
Networking	Axios (JSON-RPC over HTTP)
📋 Prerequisites

Node.js ≥ 18

npm ≥ 9

MongoDB (Atlas or local instance)

⚡ Local Development (Quick Start)

Run both backend and frontend simultaneously:

# From project root
npm install
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"


Local URLs

Backend: http://localhost:4000

Frontend: http://localhost:3000

⚠️ Ensure MongoDB is running and the backend .env file is configured.

🗂️ Environment Variables
Backend (backend/.env)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000


PORT is optional (defaults to 4000)

Create .env.example for public sharing if desired

Frontend

The frontend does not require a .env.production file unless deploying to a different backend URL.

If needed, create:

NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com

🏗️ Backend Overview

Location: backend/
Stack: Node.js + Express + TypeScript

API Endpoints
Route	Description
/api/pnodes/live	Fetches live pNodes from healthiest pRPC endpoints
/api/pnodes/history	Returns paginated historical snapshots
Development
cd backend
npm install
npm run dev

💻 Frontend Overview

Location: frontend/
Stack: Next.js + TypeScript + Tailwind CSS

Key Components
Component	Description
PNodeTable	Fixed-layout table for live and historical pNodes
PNodeHistoryChart	Line chart visualization of historical snapshots
LivePNodes	Client-side polling for live pNode updates
HistoricalPNodesClient	Paginated historical snapshot viewer
Development
cd frontend
npm install
npm run dev

🗄️ Database Design

MongoDB is used for persistent historical tracking and health metrics.

Collections
Collection	Purpose
pnodesnapshots	Stores one pNode snapshot per minute
endpointhealth	Tracks endpoint success rate and latency
🚀 Deployment
Recommended Setup
Service	Purpose
Vercel	Frontend (Next.js)
Render / Railway	Backend (Node.js + Express)
MongoDB Atlas	Database
Deployment Steps (High-Level)

Deploy backend and set MONGO_URI

Deploy frontend

Set frontend API base URL (if required)

Verify live polling and snapshot persistence

📖 Usage

Open the frontend dashboard

View live pNodes (auto-refresh every 15 seconds)

Browse historical snapshots in table and chart views

Monitor endpoint health via backend logs and database

⚡ Optional Enhancements

Historical filtering by status (online/offline)

Advanced pagination and date range filtering

Alerting for sustained offline nodes

Exportable snapshot data

📄 License

MIT © Kehinde Alao