import { Router } from "express";
import { fetchPNodeList } from "../services/prpc";
import { PNodeModel } from "../models/PNode";

const router = Router();

// Live pNodes (fetch from public endpoints)
router.get("/pnodes/live", async (_req, res) => {
  try {
    const result = await fetchPNodeList();

    const usingMock = result.some(node => node.id.startsWith("mock"));
    if (usingMock) {
      console.log("[INFO] Returned mock pNode data (all endpoints failed)");
    } else {
      console.log("[INFO] pNode data served from public pRPC endpoint");
    }

    res.json({ pnodes: result });
  } catch (err) {
    console.error(`[ERROR] Failed to fetch live pNode data: ${err}`);
    res.status(500).json({ error: "Unable to fetch live pNode data" });
  }
});

// Historical pNodes (from MongoDB)
router.get("/pnodes/history", async (_req, res) => {
  try {
    const historical = await PNodeModel.find()
      .sort({ fetchedAt: -1 })
      .limit(50)
      .lean();

    res.json({ pnodes: historical });
  } catch (err) {
    console.error(`[ERROR] Failed to fetch historical pNode data: ${err}`);
    res.status(500).json({ error: "Unable to fetch historical pNode data" });
  }
});

export default router;
