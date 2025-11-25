// app/actions/boardActions.ts
"use server";

import connectMongo from "@/db/mongoose";
import Board, { IBoard } from "@/models/board";
import { Types } from "mongoose";

export interface BoardData {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

function convertBoardToData(board: IBoard): BoardData {
  return {
    _id: board._id.toString(),
    name: board.name,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt
  };
}

function convertLeanBoardToData(board: IBoard): BoardData {
  return {
    _id: board._id.toString(),
    name: board.name,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt
  };
}

export async function getBoards(): Promise<BoardData[]> {
  try {
    await connectMongo();
    const boards = await Board.find({}).sort({ createdAt: -1 }).lean();
    return boards.map(board => convertLeanBoardToData(board as unknown as IBoard));
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}

export async function getBoard(id: string): Promise<BoardData> {
  try {
    await connectMongo();
    const board = await Board.findById(id);
    if (!board) {
      throw new Error("Board not found");
    }
    return convertBoardToData(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
}

export async function createBoard(name: string): Promise<BoardData> {
  try {
    await connectMongo();
    const newBoard = new Board({
      _id: new Types.ObjectId(),
      name,
    });
    await newBoard.save();
    return convertBoardToData(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
}

export async function updateBoard(id: string, name: string): Promise<void> {
  try {
    await connectMongo();
    await Board.updateOne({ _id: new Types.ObjectId(id) }, { name });
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
}

export async function deleteBoard(id: string): Promise<void> {
  try {
    await connectMongo();
    await Board.deleteOne({ _id: new Types.ObjectId(id) });
  } catch (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
}