# 🚀 Xandeum pNode Analytics Dashboard

A **full-stack dashboard** for monitoring Xandeum pNodes, showing **live network state**, **historical snapshots**, **endpoint health**, and persistence via **MongoDB**.  
Built with **Node.js**, **Express**, **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- 🌐 Fetch live pNode data from public pRPC endpoints
- 🗄️ Persist historical pNode snapshots in MongoDB
- 📊 Endpoint health scoring (success rate + latency)
- 📋 Live + historical pNode tables with consistent dark mode styling
- 📈 Historical line chart visualization using Recharts
- ⏱️ Auto-refresh live data every 15 seconds
- ⚠️ Fallback to mock data if all endpoints fail
- 🌑 Full dark mode support

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
### ⚡ Quick Start

Spin up both backend and frontend for demos or local testing:

```bash
# From project root
npm install
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
Backend: http://localhost:4000
Frontend: http://localhost:3000

```
⚠️ Make sure your MongoDB URI is correctly set in backend/.env.
🔹 Live pNode data will be fetched from public pRPC endpoints; fallback mock data is used if endpoints fail.

🗂️ Environment Variables
Create a .env file in backend/:


MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000
Replace <username>, <password>, <cluster>, and <appName> with your credentials.
PORT is optional (defaults to 4000). Optionally create .env.example for sharing.

🏗️ Backend
Location: backend/
Stack: Node.js + Express + TypeScript

API Endpoints:

Route	Description
/api/pnodes/live	Fetches live pNodes from public endpoints
/api/pnodes/history	Returns historical snapshots from MongoDB

Development:

```bash

cd backend
npm install
npm run dev
💻 Frontend
Location: frontend/
Stack: Next.js + TypeScript + Tailwind CSS

Key Components:

| Component                | Description                               |
|--------------------------|-------------------------------------------|
| PNodeTable               | Displays live or historical pNodes       |
| PNodeHistoryChart        | Line chart visualization                  |
| LivePNodes               | Client-side polling for live pNodes      |
| HistoricalPNodesClient   | Paginated + filtered historical pNodes   |


Development:

```bash
Copy code
cd frontend
npm install
npm run dev


🗄️ Database
MongoDB stores historical pNode snapshots and endpoint health metrics.

Collections:

pnodes → Stores each fetched pNode snapshot with timestamp

endpointHealth → Stores historical endpoint health metrics

Ensure MONGO_URI is correct.

🚀 Usage
Open the frontend at: http://localhost:3000

Live pNodes auto-refresh every 15 seconds

Historical snapshots display in table + line chart

Endpoint health scoring visible in backend logs and MongoDB

⚡ Optional Enhancements
Historical filtering by status (online/offline) and pagination cursor

Endpoint availability awareness with automatic mock fallback

Pagination for efficient browsing of historical data

📄 License
MIT © Kehinde Alao


