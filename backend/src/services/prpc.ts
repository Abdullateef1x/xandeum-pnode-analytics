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
 * Core fetch logic
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

        // Persist **snapshot** of this tick
        if (saveToDb) {
          await PNodeModel.insertMany(
            pnodes.map((p) => ({
              ...p,
              fetchedAt: new Date(), // unique timestamp for this cron tick
            }))
          );
        }

        // Only return for first live endpoint
        if (!firstSuccessfulPNodes) firstSuccessfulPNodes = pnodes;

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

  const fetchPromises = endpoints.map((url) => fetchFromEndpoint(url));

  // Return first successful immediately
  const firstResult = await Promise.race(fetchPromises);

  // Let background fetches continue
  Promise.all(fetchPromises).then(() => persistHealthSnapshot()).catch(console.error);

  if (firstResult) return firstResult;

  // Fallback
  if (saveToDb) {
    await PNodeModel.insertMany(MOCK_PNODES.map((p) => ({ ...p, fetchedAt: new Date() })));
  }

  return MOCK_PNODES;
}

/**
 * Cron job: fetch and save snapshot every minute
 */
export function startPNodeCron() {
  cron.schedule("* * * * *", async () => {
    console.log("[CRON] Fetching live pNodes...");
    try {
      await fetchPNodeList(true);
      console.log("[CRON] Snapshot saved.");
    } catch (err) {
      console.error("[CRON] Failed to fetch pNodes:", err);
    }
  });
}
