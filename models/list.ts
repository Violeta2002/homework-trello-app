// models/list.ts
import { model, models, Schema, Types, Document } from "mongoose";

export interface IList extends Document {
  _id: Types.ObjectId;
  name: string;
  boardId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema({
  _id: { type: Types.ObjectId, required: true },
  name: { type: String, required: true },
  boardId: { type: String, required: true },
  order: { type: Number, required: true },
}, {
  timestamps: true
});

export default models.List || model<IList>("List", ListSchema, "lists");