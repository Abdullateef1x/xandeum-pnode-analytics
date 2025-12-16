import { Schema, model } from "mongoose";

export interface PNodeSnapshot {
  fetchedAt: Date;
  total: number;
  online: number;
  offline: number;
}

const PNodeSnapshotSchema = new Schema<PNodeSnapshot>({
  fetchedAt: { type: Date, required: true, index: true },
  total: { type: Number, required: true },
  online: { type: Number, required: true },
  offline: { type: Number, required: true },
});

export const PNodeSnapshotModel = model<PNodeSnapshot>(
  "PNodeSnapshot",
  PNodeSnapshotSchema
);
