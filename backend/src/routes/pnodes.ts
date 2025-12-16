import { Router } from "express";
import { fetchLivePNodes, GossipNode } from "../services/prpc";

const router = Router();

// Live pNodes (fetch from healthiest endpoints, no DB writes)
router.get("/pnodes/live", async (_req, res) => {
  try {
    const result: GossipNode[] = await fetchLivePNodes();

    // TypeScript safe check: node explicitly typed
    const usingMock = result.some((node: GossipNode) => node.id.startsWith("mock"));

    if (process.env.NODE_ENV !== "production") {
      if (usingMock) {
        console.warn("[WARN] Returned mock pNode data (all endpoints failed)");
      } else {
        console.log("[INFO] pNode data served from live pRPC endpoints");
      }
    }

    res.json({ pnodes: result });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Failed to fetch live pNode data:", err);
    }

    res.status(500).json({ error: "Unable to fetch live pNode data" });
  }
});

export default router;
