# Xandeum pNode Analytics Dashboard

A **full-stack dashboard** for monitoring Xandeum pNodes, showing **live network state**, **historical snapshots**, **endpoint health**, and persistence via **MongoDB**. Built with **Node.js**, **Express**, **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

## Features

- Fetch live pNode data from public pRPC endpoints
- Persist historical pNode snapshots in MongoDB
- Endpoint health scoring (success rate + latency)
- Live + historical pNode tables with consistent dark mode styling
- Historical line chart visualization using Recharts
- Auto-refresh live data every 15 seconds
- Fallback to mock data if all endpoints fail
- Full dark mode support

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** (Atlas or local instance)

---

### Quick Start (One-Liner)

Spin up **both backend and frontend** with a single command for demos or local testing:

```bash
# From the project root
npm install && concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
npm install → Installs dependencies for both backend and frontend

concurrently → Runs multiple commands simultaneously

cd backend && npm run dev → Starts the backend on http://localhost:4000

cd frontend && npm run dev → Starts the frontend on http://localhost:3000

⚠️ Make sure your MongoDB URI is correctly set in backend/.env.
🔹 Live pNode data will be fetched from public pRPC endpoints; fallback mock data is used if endpoints fail.

Environment Variables
Create a .env file in the backend directory:

env
Copy code
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000
Replace <username>, <password>, <cluster>, and <appName> with your MongoDB Atlas credentials

PORT is optional; defaults to 4000

You can create a .env.example file with placeholders for public sharing.

Backend
Location: backend/

Stack: Node.js + Express + TypeScript

Endpoints:

Route	Description
/api/pnodes/live	Fetches live pNodes from public endpoints
/api/pnodes/history	Returns historical snapshots stored in MongoDB

Development:

bash
Copy code
cd backend
npm install
npm run dev
Frontend
Location: frontend/

Stack: Next.js + TypeScript + Tailwind CSS

Key Components:

Component	Description
PNodeTable	Displays live or historical pNodes in a table
PNodeHistoryChart	Line chart visualization of historical snapshots
LivePNodes	Client-side polling for live pNodes
HistoricalPNodesClient	Paginated + filtered historical pNodes

Development:

bash
Copy code
cd frontend
npm install
npm run dev
Database
MongoDB stores historical pNode snapshots and endpoint health metrics.

Collections:

pnodes → Stores each fetched pNode snapshot with timestamp

endpointHealth → Stores historical endpoint health metrics

Ensure MONGO_URI is correct.

Usage
Open the frontend at: http://localhost:3000

Live pNodes auto-refresh every 15 seconds

Historical snapshots display in table + line chart

Endpoint health scoring visible in backend logs and MongoDB

## Optional Enhancements

The following features were implemented to improve usability and observability beyond the core bounty requirements:

- **Dark / Light Theme Toggle**  
  Allows users to switch themes for better readability and accessibility.

- **Historical Filtering**  
  Filter historical pNode snapshots by status (online/offline) and pagination cursor for easier analysis.

- **Endpoint Availability Awareness**  
  The system detects when all public pRPC endpoints are unavailable and automatically falls back to mock data, ensuring the dashboard remains usable.

- **Pagination for Historical Data**  
  Cursor-based pagination is used to efficiently browse large historical datasets without overwhelming the UI or backend.

License
MIT © Kehinde Alao

yaml
Copy code
