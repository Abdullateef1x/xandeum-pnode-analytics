Xandeum pNode Analytics Dashboard

A full-stack dashboard for monitoring Xandeum pNodes, showing live network state, historical snapshots, endpoint health, and persistence via MongoDB. Built with Node.js, Express, Next.js, TypeScript, and Tailwind CSS.

Features

Fetch live pNode data from public pRPC endpoints

Persist historical pNode snapshots in MongoDB

Endpoint health scoring (success rate + latency)

Live + historical pNode tables with dark mode styling

Historical line chart visualization using Recharts

Auto-refresh live data every 15 seconds

Fallback to mock data if endpoints fail

Full dark mode support

Getting Started
Prerequisites

Node.js >= 18

npm >= 9

MongoDB (Atlas or local instance)

Quick Start

Spin up both backend and frontend with a single command:

# From project root
npm install
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"


Backend runs on http://localhost:4000

Frontend runs on http://localhost:3000

Ensure MONGO_URI is set correctly in backend/.env

Environment Variables

Create a .env file in backend/:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
PORT=4000


Replace <username>, <password>, <cluster>, <appName> with your MongoDB credentials

PORT is optional; defaults to 4000

Optionally create .env.example for public sharing

Backend

Location: backend/
Stack: Node.js + Express + TypeScript

API Endpoints:

Route	Description
/api/pnodes/live	Fetches live pNodes from public endpoints
/api/pnodes/history	Returns historical snapshots from MongoDB

Development:

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
HistoricalPNodesClient	Paginated and filtered historical pNodes

Development:

cd frontend
npm install
npm run dev

Database

MongoDB stores historical pNode snapshots and endpoint health metrics.

Collections:

pnodes → Stores fetched pNode snapshots with timestamps

endpointHealth → Stores historical endpoint health metrics

Usage

Open the frontend at http://localhost:3000

Live pNodes auto-refresh every 15 seconds

Historical snapshots display in table + line chart

Endpoint health scoring visible in backend logs and MongoDB

Optional Enhancements

Dark / Light Theme Toggle for readability

Historical Filtering by status (online/offline) with pagination

Endpoint Availability Awareness with automatic mock fallback

Pagination for efficient browsing of historical data

License

MIT © Kehinde Alao