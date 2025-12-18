import { Router, Request, Response } from "express";
import { getHealthScores } from "../services/endpointHealth";
import { EndpointHealthSnapshot } from "../models/EndpointHealthSnapshot";

const router = Router();

// Live endpoint health
router.get("/endpoints/health", (_req: Request, res: Response) => {
  res.json({ endpoints: getHealthScores() });
});

// Historical endpoint health
router.get("/endpoints/health/history", async (_req: Request, res: Response) => {
  try {
    const history = await EndpointHealthSnapshot.find()
      .sort({ timestamp: -1 })
      .limit(200);

    res.json({ history });
  } catch (err) {
    console.error("Failed to fetch endpoint health history:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
