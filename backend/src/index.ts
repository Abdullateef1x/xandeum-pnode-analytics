import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import pnodeRoutes from "./routes/pnodes";
import historyRoutes from "./routes/history";
import healthRoutes from "./routes/endpoints";

dotenv.config();
connectDB();


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

app.listen(4000, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
