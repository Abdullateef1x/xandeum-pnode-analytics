import axios from "axios";
import cron from "node-cron";
import { PNodeModel } from "../models/PNode";
import {
  getSortedHealthyEndpoints,
  recordFailure,
  recordSuccess,
  persistHealthSnapshot,
} from "./endpointHealth";

export interface GossipNode {
  id: string;
  type: string;
  address?: string;
  status?: string;
  lastSeen?: number;
}

// Fallback mock data
const MOCK_PNODES: GossipNode[] = [
  { id: "mock1", type: "pNode", address: "0x123", status: "offline" },
  { id: "mock2", type: "pNode", address: "0x456", status: "offline" },
];

const MAX_RETRIES = 3;

/**
 * Fetch pNodes from endpoints
 * @param saveToDb whether to persist snapshot
 */
export async function fetchPNodeList(saveToDb = true): Promise<GossipNode[]> {
  const endpoints = getSortedHealthyEndpoints();
  let firstSuccessfulPNodes: GossipNode[] | null = null;

  const fetchFromEndpoint = async (url: string): Promise<GossipNode[] | null> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const start = Date.now();
        const response = await axios.post(
          url,
          { jsonrpc: "2.0", id: 1, method: "get-pods", params: [] },
          { timeout: 5000 }
        );

        const latency = Date.now() - start;
        recordSuccess(url, latency);

        const pods = response.data?.result?.pods;
        if (!pods?.length) {
          recordFailure(url);
          continue;
        }

        const pnodes: GossipNode[] = pods.map((pod: any) => ({
          id: pod.address,
          type: "pNode",
          address: pod.address,
          status: "online",
          lastSeen: pod.last_seen_timestamp,
        }));

        if (saveToDb && !firstSuccessfulPNodes) {
          firstSuccessfulPNodes = pnodes;
          await PNodeModel.insertMany(
            pnodes.map((p) => ({ ...p, fetchedAt: new Date() }))
          );
        }

        return pnodes;
      } catch (err) {
        recordFailure(url);
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[WARN] ${url} failed on attempt ${attempt}:`, err);
        }
      }
    }
    return null;
  };

  // Run all endpoints in parallel
  const fetchPromises = endpoints.map((url) => fetchFromEndpoint(url));
  const firstResult = await Promise.race(fetchPromises);

  // Continue other fetches in background
  Promise.all(fetchPromises).then(() => persistHealthSnapshot()).catch(console.error);

  if (firstResult) return firstResult;

  if (saveToDb) {
    await PNodeModel.insertMany(
      MOCK_PNODES.map((p) => ({ ...p, fetchedAt: new Date() }))
    );
  }

  return firstResult || MOCK_PNODES;
}

/**
 * Cron job to snapshot pNodes every minute
 */
export function startPNodeCron() {
  cron.schedule("* * * * *", async () => {
    console.log("[CRON] Fetching pNodes...");
    try {
      await fetchPNodeList(true);
      console.log("[CRON] Snapshot saved.");
    } catch (err) {
      console.error("[CRON] Error fetching pNodes:", err);
    }
  });
}

/**
 * For first run only: generate fake historical snapshots
 * to ensure chart shows a wavy line immediately
 */
export async function seedInitialSnapshots() {
  const existing = await PNodeModel.countDocuments();
  if (existing > 0) return;

  console.log("[SEED] Generating initial snapshots...");
  const now = Date.now();
  for (let i = 10; i >= 0; i--) {
    const ts = new Date(now - i * 60_000); // 1-min interval
    await PNodeModel.insertMany(
      MOCK_PNODES.map((p) => ({ ...p, fetchedAt: ts }))
    );
  }
}
