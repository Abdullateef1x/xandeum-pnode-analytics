import { Router } from "express";
import { getHealthScores } from "../services/endpointHealth";
import { EndpointHealthSnapshot } from "../models/EndpointHealthSnapshot";

const router = Router();

router.get("/endpoints/health", (_, res) => {
  res.json({ endpoints: getHealthScores() });
});

router.get("/endpoints/health/history", async (_, res) => {
  const history = await EndpointHealthSnapshot.find()
    .sort({ timestamp: -1 })
    .limit(200);

  res.json({ history });
});

export default router;
