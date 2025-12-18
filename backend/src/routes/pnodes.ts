import { Router, Request, Response } from "express";
import { fetchLivePNodes, GossipNode } from "../services/prpc";

const router = Router();

// Centralized dev-only flag
const isDev = process.env.NODE_ENV !== "production";

// Live pNodes (fetch from healthiest endpoints, no DB writes)
router.get("/pnodes/live", async (_req: Request, res: Response) => {
  try {
    const result: GossipNode[] = await fetchLivePNodes();

    // TypeScript-safe check
    const usingMock = result.some((node: GossipNode) =>
      node.id.startsWith("mock")
    );

    if (isDev) {
      if (usingMock) {
        console.warn("[WARN] Returned mock pNode data (all endpoints failed)");
      } else {
        console.log("[INFO] pNode data served from live pRPC endpoints");
      }
    }

    res.json({ pnodes: result });
  } catch (err) {
    if (isDev) {
      console.error("[ERROR] Failed to fetch live pNode data:", err);
    }

    res.status(500).json({
      error: "Unable to fetch live pNode data",
    });
  }
});

export default router;
