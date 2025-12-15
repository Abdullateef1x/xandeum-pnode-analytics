import axios from "axios";
import { PNodeModel } from "../models/PNode";
import {
  getSortedHealthyEndpoints,
  initEndpoints,
  recordFailure,
  recordSuccess,
} from "./endpointHealth";
import { persistHealthSnapshot } from "./endpointHealth";

interface GossipNode {
  id: string;
  type: string;
  address?: string;
  status?: string;
  lastSeen?: number;
}

// Mock fallback if all endpoints fail
const MOCK_PNODES: GossipNode[] = [
  { id: "mock1", type: "pNode", address: "0x123", status: "offline" },
  { id: "mock2", type: "pNode", address: "0x456", status: "offline" },
];

// Maximum retry attempts per endpoint
const MAX_RETRIES = 3;

/**
 * Fetch live pNodes from public endpoints.
 * Retries failing endpoints up to MAX_RETRIES times.
 */
export async function fetchPNodeList(): Promise<GossipNode[]> {

  // Sort endpoints by health score
  const endpoints = getSortedHealthyEndpoints();

  for (const url of endpoints) {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;
      const start = Date.now();

      try {
        if (process.env.NODE_ENV !== "production") {
          console.log(`[INFO] Trying endpoint: ${url} (attempt ${attempt})`);
        }

        const response = await axios.post(
          url,
          {
            jsonrpc: "2.0",
            id: 1,
            method: "get-pods",
            params: [],
          },
          { timeout: 5000 }
        );

        const latency = Date.now() - start;
        recordSuccess(url, latency);

        const pods = response.data?.result?.pods;

        if (!pods?.length) {
          recordFailure(url); // empty response treated as failure
          continue; // retry same endpoint
        }

        const pnodes: GossipNode[] = pods.map((pod: any) => ({
          id: pod.address,
          type: "pNode",
          address: pod.address,
          status: "online",
          lastSeen: pod.last_seen_timestamp,
        }));

        // Persist pNodes
        await PNodeModel.insertMany(
          pnodes.map((p) => ({ ...p, fetchedAt: new Date() }))
        );

        if (process.env.NODE_ENV !== "production") {
          console.log(
            `[INFO] Served from ${url} | latency=${latency}ms | nodes=${pnodes.length}`
          );
        }

        await persistHealthSnapshot();


        // Return the first live endpoint
        return pnodes;
      } catch (err) {
        recordFailure(url);

        if (process.env.NODE_ENV !== "production") {
          const msg = err instanceof Error ? err.message : "";
          console.warn(`[WARN] ${url} failed on attempt ${attempt}: ${msg}`);
        }
      }
    }
  }

  // If no endpoint succeeded, fallback to mock
  if (process.env.NODE_ENV !== "production") {
    console.warn("[WARN] All endpoints failed after retries. Using mock data.");
  }

  await PNodeModel.insertMany(
    MOCK_PNODES.map((p) => ({ ...p, fetchedAt: new Date() }))
  );

  persistHealthSnapshot(); // fire-and-forget
  return MOCK_PNODES;
}
