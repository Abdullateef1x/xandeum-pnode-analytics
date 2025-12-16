import { Router } from "express";
import { PNodeSnapshotModel } from "../models/PNodeSnapshot";

const router = Router();

/**
 * GET /pnodes/history
 * Query params:
 *   - limit?: number (default 25, max 100)
 *   - cursor?: ISO date string to paginate backwards
 */
router.get("/pnodes/history", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const cursor = req.query.cursor as string | undefined;

    // Build query
    const query: Record<string, any> = {};
    if (cursor) {
      query.fetchedAt = { $lt: new Date(cursor) };
    }

    // Fetch snapshots sorted descending
    const snapshots = await PNodeSnapshotModel.find(query)
      .sort({ fetchedAt: -1 })
      .limit(limit + 1); // +1 to check for nextCursor

    let nextCursor: string | null = null;
    if (snapshots.length > limit) {
      const next = snapshots.pop(); // remove extra snapshot
      nextCursor = next!.fetchedAt.toISOString();
    }

    // Convert snapshots to frontend-friendly format
    const pnodes = snapshots
      .map((s) => ({
        fetchedAt: s.fetchedAt,
        total: s.total,
        online: s.online,
        offline: s.offline,
      }))
      .sort((a, b) => a.fetchedAt.getTime() - b.fetchedAt.getTime()); // ascending for chart

    res.json({ pnodes, nextCursor });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] Failed to fetch pNode snapshots:", err);
    }
    res.status(500).json({ error: "Failed to fetch pNode history" });
  }
});

export default router;
