# 🚀 Xandeum pNode Analytics Dashboard

A **full-stack analytics dashboard** for monitoring Xandeum pNodes.

The platform provides **live network visibility**, **historical snapshots**, **endpoint health monitoring**, and **persistent storage** using MongoDB.

Built with **Node.js**, **Express**, **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- 🌐 Fetches **live pNode data** from public pRPC endpoints  
- 🗄️ Stores **historical pNode snapshots** in MongoDB  
- 📊 **Endpoint health scoring** based on success rate and latency  
- 📋 **Live and historical tables** with consistent fixed-column layout  
- 📈 **Time-series line chart** for historical pNode counts  
- ⏱️ **Automatic refresh** of live data every 15 seconds  
- ⚠️ **Graceful fallback** to mock data if endpoints fail  
- 🌑 **Dark mode UI** optimized for monitoring dashboards  

---

## 🛠️ Tech Stack

| Layer     | Technology |
|----------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Recharts |
| Backend  | Node.js, Express, TypeScript |
| Database | MongoDB |
| Scheduler | node-cron |
| Networking | Axios (JSON-RPC over HTTP) |

---

## 📋 Prerequisites

- **Node.js** ≥ 18  
- **npm** ≥ 9  
- **MongoDB** (Atlas or local instance)  

---

## ⚡ Local Development (Quick Start)

Run both backend and frontend together:

```bash
npm install
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
Local URLs
Backend: http://localhost:4000

Frontend: http://localhost:3000

⚠️ Ensure MongoDB is running and the backend .env file is configured.

🗂️ Environment Variables
Backend (backend/.env)
env
Copy code
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000
PORT is optional (defaults to 4000)

Replace placeholders with your MongoDB credentials

Frontend
The frontend does not require a .env.production file unless deploying to a different backend.

If required:

env
Copy code
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
🏗️ Backend Overview
Location: backend/
Stack: Node.js + Express + TypeScript

API Endpoints
Route	Description
/api/pnodes/live	Fetches live pNodes from healthiest endpoints
/api/pnodes/history	Returns paginated historical snapshots

Development
bash
Copy code
cd backend
npm install
npm run dev
💻 Frontend Overview
Location: frontend/
Stack: Next.js + TypeScript + Tailwind CSS

Key Components
Component	Description
PNodeTable	Fixed-layout table for pNodes
PNodeHistoryChart	Line chart for historical data
LivePNodes	Client-side polling (15s)
HistoricalPNodesClient	Paginated history viewer

Development
bash
Copy code
cd frontend
npm install
npm run dev
🗄️ Database Design
MongoDB is used for persistent historical tracking and endpoint health metrics.

Collections
Collection	Purpose
pnodesnapshots	Stores pNode snapshots
endpointhealth	Stores endpoint latency and success rate

🚀 Deployment
Recommended Services
Service	Purpose
Vercel	Frontend (Next.js)
Render / Railway	Backend (Node.js)
MongoDB Atlas	Database

Deployment Steps
Deploy backend and set MONGO_URI

Deploy frontend

Configure frontend API base URL (if needed)

Verify live polling and snapshot persistence

📖 Usage
Open the dashboard in the browser

View live pNodes (auto-refresh every 15 seconds)

Browse historical snapshots in table and chart views

Monitor endpoint health via logs and MongoDB

📄 License
MIT © Kehinde Alao

yaml
Copy code
