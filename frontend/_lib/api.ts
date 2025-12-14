export interface PNode {
id: string;
type: string;
address?: string;
status?: string;
lastSeen?: number;
fetchedAt?: string;
}


export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


export async function fetchLivePNodes(): Promise<PNode[]> {
const res = await fetch(`${BASE_URL}/pnodes/live`, {
cache: "no-store",
});
const data = await res.json();
return data.pnodes;
}


export async function fetchHistoricalPNodes(cursor?: string,
  limit = 25,
  status?: "online" | "offline") {

    const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (status) params.set("status", status);


const res = await fetch(`${BASE_URL}/pnodes/history?${params?.toString()}`, {
cache: "no-store",
});

if (!res.ok) {
  throw new Error(`Error fetching historical pNodes: ${res.statusText}`);
}
  return res.json() as Promise<{
    pnodes: PNode[];
    nextCursor: string | null;
  }>;

}