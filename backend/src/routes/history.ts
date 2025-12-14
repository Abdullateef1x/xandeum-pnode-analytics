import { Router } from "express";
import { PNodeModel } from "../models/PNode";

const router = Router();

router.get("/pnodes/history", async (req, res) => {
    try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const cursor = req.query.cursor as string | undefined;
    const status = req.query.status as string | undefined;

    const query: any = {};

    if (cursor) {
      query.fetchedAt = { $lt: new Date(cursor) };
    }

    if (status === "online" || status === "offline") {
      query.status = status;
    }

    const pnodes = await PNodeModel.find(query)
      .sort({ fetchedAt: -1 })
      .limit(limit + 1);

    let nextCursor: string | null = null;
    if (pnodes.length > limit) {
      const next = pnodes.pop();
      nextCursor = next!.fetchedAt.toISOString();
    }

    res.json({
      pnodes,
      nextCursor,
    });
  } catch (err) {

    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Failed to fetch history:", err);
    }

    res.status(500).json({ error: "Failed to fetch history" });
  }

});

export default router;