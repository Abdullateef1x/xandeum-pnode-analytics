import { Router } from "express";
import { fetchPNodeList } from "../services/prpc";
import { PNodeModel } from "../models/PNode";

const router = Router();

// Live pNodes (fetch from public endpoints)
router.get("/pnodes/live", async (_req, res) => {
  try {
    const result = await fetchPNodeList();

    const usingMock = result.some(node => node.id.startsWith("mock"));

    if (process.env.NODE_ENV !== "production") {
      if (usingMock) {
        console.warn("[WARN] Returned mock pNode data (all endpoints failed)");
      } else {
        console.log("[INFO] pNode data served from public pRPC endpoint");
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
