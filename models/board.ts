// models/board.ts
import { model, models, Schema, Types, Document } from "mongoose";

export interface IBoard extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema({
  _id: { type: Types.ObjectId, required: true },
  name: { type: String, required: true },
}, {
  timestamps: true
});

export default models.Board || model<IBoard>("Board", BoardSchema, "boards");