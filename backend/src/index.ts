import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import pnodeRoutes from "./routes/pnodes";
import historyRoutes from "./routes/history";
import healthRoutes from "./routes/endpoints";
import { seedInitialSnapshots, startPNodeCron } from "./services/prpc";

dotenv.config();
connectDB();

// Seed initial snapshots and start cron
seedInitialSnapshots()
  .then(() => {
    if (process.env.NODE_ENV !== "production")
    console.log("[INIT] Initial pNode snapshots seeded")
  })
  .catch(err => {
    if (process.env.NODE_ENV !== "production")
    console.error("[INIT] Failed to seed snapshots:", err)
  });

startPNodeCron(); // start the cron to create new snapshots every minute

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", pnodeRoutes);
app.use("/api", historyRoutes);
app.use("/api", healthRoutes);

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Backend running on http://localhost:${PORT}`);
  }
});
