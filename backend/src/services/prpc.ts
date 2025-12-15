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

const MOCK_PNODES: GossipNode[] = [
  { id: "mock1", type: "pNode", address: "0x123", status: "offline" },
  { id: "mock2", type: "pNode", address: "0x456", status: "offline" },
];

const MAX_RETRIES = 3;

/**
 * Core function: fetch pNodes from endpoints
 * @param saveToDb whether to persist first successful result to MongoDB
 */
export async function fetchPNodeList(saveToDb = true): Promise<GossipNode[]> {
  const endpoints = getSortedHealthyEndpoints();
  let firstSuccessfulPNodes: GossipNode[] | null = null;

  const fetchFromEndpoint = async (url: string): Promise<GossipNode[] | null> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const start = Date.now();
      try {
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

        // Persist only for the first successful endpoint
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
          const msg = err instanceof Error ? err.message : "";
          console.warn(`[WARN] ${url} failed on attempt ${attempt}: ${msg}`);
        }
      }
    }
    return null;
  };

  // Launch all endpoints in parallel
  const fetchPromises = endpoints.map((url) => fetchFromEndpoint(url));

  // Return first successful result immediately for UI
  const firstResult = await Promise.race(fetchPromises);

  // Continue updating health and background fetches
  Promise.all(fetchPromises).then(() => persistHealthSnapshot()).catch(console.error);

  if (firstResult) return firstResult;

  // Fallback to mock if none succeeded
  if (process.env.NODE_ENV !== "production") {
    console.warn("[WARN] All endpoints failed. Returning mock data.");
  }

  if (saveToDb) {
    await PNodeModel.insertMany(MOCK_PNODES.map((p) => ({ ...p, fetchedAt: new Date() })));
  }

  return MOCK_PNODES;
}

/**
 * Cron job: fetch and save pNodes every minute
 * This is completely independent of the frontend
 */
export function startPNodeCron() {
  cron.schedule("* * * * *", async () => {
    console.log("[CRON] Running fetchPNodeList...");
    try {
      await fetchPNodeList(true); // save snapshot
      console.log("[CRON] Done fetching pNodes.");
    } catch (err) {
      console.error("[CRON] Error fetching pNodes:", err);
    }
  });
}
