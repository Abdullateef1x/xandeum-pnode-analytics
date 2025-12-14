import { EndpointHealthSnapshot } from "../models/EndpointHealthSnapshot";

// Health info for each endpoint
export interface EndpointHealth {
  url: string;
  successCount: number;
  failureCount: number;
  avgLatency: number;
  lastChecked?: string;
}

// Map to track live endpoint health stats
const healthMap = new Map<string, EndpointHealth>();

/**
 * Initialize endpoint in the health map if it doesn't exist.
 */
export function initEndpoint(url: string) {
  if (!healthMap.has(url)) {
    healthMap.set(url, {
      url,
      successCount: 0,
      failureCount: 0,
      avgLatency: 0,
    });
  }
}

/**
 * Record a successful request to the endpoint.
 * Updates average latency and last checked timestamp.
 */
export function recordSuccess(url: string, latency: number) {
  const h = healthMap.get(url)!;
  h.successCount += 1;
  h.avgLatency =
    h.avgLatency === 0 ? latency : (h.avgLatency + latency) / 2;
  h.lastChecked = new Date().toISOString();
}

/**
 * Record a failed request to the endpoint.
 * Updates last checked timestamp.
 */
export function recordFailure(url: string) {
  const h = healthMap.get(url)!;
  h.failureCount += 1;
  h.lastChecked = new Date().toISOString();
}

/**
 * Compute health scores for all endpoints.
 * Score is based on success rate and penalized by average latency.
 */
export function getHealthScores() {
  return Array.from(healthMap.values()).map((h) => {
    const total = h.successCount + h.failureCount;
    const successRate = total === 0 ? 0 : h.successCount / total;

    const score = Math.max(
      0,
      Math.round(successRate * 100 - h.avgLatency / 100)
    );

    return {
      ...h,
      successRate: Number((successRate * 100).toFixed(1)),
      score,
    };
  });
}

/**
 * Returns URLs sorted by health score (highest score first)
 */
export function getSortedHealthyEndpoints(): string[] {
  return getHealthScores()
    .sort((a, b) => b.score - a.score)
    .map((e) => e.url);
}

/**
 * Persist current health snapshot to MongoDB.
 * Useful for historical analysis.
 */
export async function persistHealthSnapshot() {
  try {
    const scores = getHealthScores();

    await EndpointHealthSnapshot.insertMany(
      scores.map((s) => ({
        url: s.url,
        successCount: s.successCount,
        failureCount: s.failureCount,
        avgLatency: s.avgLatency,
        successRate: s.successRate,
        score: s.score,
      }))
    );
  } catch (err) {
    console.warn("[WARN] Failed to persist health snapshot");
  }
}
