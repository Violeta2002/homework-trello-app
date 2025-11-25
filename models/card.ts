// models/card.ts
import { model, models, Schema, Types, Document } from "mongoose";

export interface ICard extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  listId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema({
  _id: { type: Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  listId: { type: String, required: true },
  order: { type: Number, required: true },
}, {
  timestamps: true
});

export default models.Card || model<ICard>("Card", CardSchema, "cards");