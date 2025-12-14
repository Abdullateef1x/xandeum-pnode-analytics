import axios from "axios";
import { PNodeModel } from "../models/PNode";
import { getSortedHealthyEndpoints, recordFailure, recordSuccess } from "./endpointHealth";
import { persistHealthSnapshot } from "./endpointHealth";


interface GossipNode {
  id: string;
  type: string;
  address?: string;
  status?: string;
  lastSeen?: number;
}

// List of publicly open pRPC endpoints
const PRPC_URLS = [
  "http://173.212.203.145:6000/rpc",
  "http://173.212.220.65:6000/rpc",
  "http://161.97.97.41:6000/rpc",
  "http://192.190.136.36:6000/rpc",
  "http://192.190.136.37:6000/rpc",
  "http://192.190.136.38:6000/rpc",
  "http://192.190.136.28:6000/rpc",
  "http://192.190.136.29:6000/rpc",
  "http://207.244.255.1:6000/rpc"
];

// Mock fallback data if all endpoints fail
const MOCK_PNODES: GossipNode[] = [
  { id: "mock1", type: "pNode", address: "0x123", status: "offline" },
  { id: "mock2", type: "pNode", address: "0x456", status: "offline" }
];

// Attempts to fetch live pNode data from public pRPC endpoints.
// Uses health-aware rotation and falls back to mock data
// to keep the API stable when endpoints are unavailable.
export async function fetchPNodeList(): Promise<GossipNode[]> {
  
  // Sort endpoints by health score so the most reliable one is tried first.
// This reduces latency and avoids repeatedly hitting failing endpoints.
  const endpoints = getSortedHealthyEndpoints();

  for (const url of endpoints) {
    const start = Date.now();

    try {
      console.log(`[INFO] Trying endpoint: ${url}`);

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
      if (!pods?.length) continue;

      const pnodes: GossipNode[] = pods.map((pod: any) => ({
        id: pod.address,
        type: "pNode",
        address: pod.address,
        status: "online",
        lastSeen: pod.last_seen_timestamp,
      }));

      // Persist snapshot
      await PNodeModel.insertMany(
        pnodes.map((p) => ({
          ...p,
          fetchedAt: new Date(),
        }))
      );

      console.log(
        `[INFO] Served from ${url} | latency=${latency}ms | nodes=${pnodes.length}`
      );

      return pnodes;
    } catch (err) {
      recordFailure(url);

      if (err instanceof Error) {
        console.warn(`[WARN] ${url} failed: ${err.message}`);
      } else {
        console.warn(`[WARN] ${url} failed`);
      }
    }
  }

  //  All endpoints failed → mock fallback
  console.warn("[WARN] All public pRPC endpoints failed. Using mock data.");

  await PNodeModel.insertMany(
    MOCK_PNODES.map((p) => ({
      ...p,
      fetchedAt: new Date(),
    }))
  );

  persistHealthSnapshot(); // fire-and-forget


  return MOCK_PNODES;
}
