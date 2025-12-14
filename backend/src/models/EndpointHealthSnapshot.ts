import mongoose from "mongoose";

/**
 * Schema for storing historical endpoint health snapshots.
 * Each document represents a single snapshot of all endpoint metrics at a given time.
 */

const EndpointHealthSchema = new mongoose.Schema(
  {

    url: { type: String, required: true },     // The endpoint URL being monitored

    successCount: Number,
    failureCount: Number,
    avgLatency: Number,     // Average latency (in milliseconds) of successful requests
    successRate: Number,
    score: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "endpoint_health_snapshots" }
);

/**
 * Model for historical endpoint health snapshots.
 * Uses existing model if it exists to prevent recompilation errors in dev/hot reload.
 */
export const EndpointHealthSnapshot =
  mongoose.models.EndpointHealthSnapshot ||
  mongoose.model("EndpointHealthSnapshot", EndpointHealthSchema);
