// app/actions/listActions.ts
"use server";

import connectMongo from "@/db/mongoose";
import List, { IList } from "@/models/list";
import { Types } from "mongoose";

export interface ListData {
  _id: string;
  name: string;
  boardId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

function convertListToData(list: IList): ListData {
  return {
    _id: list._id.toString(),
    name: list.name,
    boardId: list.boardId,
    order: list.order,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt
  };
}

function convertLeanListToData(list: IList): ListData {
  return {
    _id: list._id.toString(),
    name: list.name,
    boardId: list.boardId,
    order: list.order,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt
  };
}

export async function getLists(boardId: string): Promise<ListData[]> {
  try {
    await connectMongo();
    const lists = await List.find({ boardId }).sort({ order: 1 }).lean();
    return lists.map(list => convertLeanListToData(list as unknown as IList));
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
}

export async function createList(boardId: string, name: string): Promise<ListData> {
  try {
    await connectMongo();
    
    const lastList = await List.findOne({ boardId }).sort({ order: -1 });
    const newOrder = lastList ? lastList.order + 1 : 0;
    
    const newList = new List({
      _id: new Types.ObjectId(),
      name,
      boardId,
      order: newOrder,
    });
    
    await newList.save();
    return convertListToData(newList);
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}

export async function updateList(id: string, name: string): Promise<void> {
  try {
    await connectMongo();
    await List.updateOne({ _id: new Types.ObjectId(id) }, { name });
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
}

export async function deleteList(id: string): Promise<void> {
  try {
    await connectMongo();
    await List.deleteOne({ _id: new Types.ObjectId(id) });
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
}
