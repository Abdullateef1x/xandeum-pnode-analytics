import { Schema, model } from "mongoose";

interface PNode {
  id: string;
  type: string;
  address?: string;
  status?: string;
  lastSeen?: number;
  fetchedAt: Date; // timestamp for historical tracking
}

const PNodeSchema = new Schema<PNode>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  address: String,
  status: String,
  lastSeen: Number,
  fetchedAt: { type: Date, default: Date.now },
});

export const PNodeModel = model<PNode>("PNode", PNodeSchema);
