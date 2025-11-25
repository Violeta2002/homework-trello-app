// app/actions/cardActions.ts
"use server";

import connectMongo from "@/db/mongoose";
import Card, { ICard } from "@/models/card";
import { Types } from "mongoose";

export interface CardData {
  _id: string;
  title: string;
  description: string;
  listId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

function convertCardToData(card: ICard): CardData {
  return {
    _id: card._id.toString(),
    title: card.title,
    description: card.description,
    listId: card.listId,
    order: card.order,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt
  };
}

function convertLeanCardToData(card: any): CardData {
  return {
    _id: card._id.toString(),
    title: card.title,
    description: card.description,
    listId: card.listId,
    order: card.order,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt
  };
}

export async function getCards(listId: string): Promise<CardData[]> {
  try {
    await connectMongo();
    const cards = await Card.find({ listId }).sort({ order: 1 }).lean();
    return cards.map(card => convertLeanCardToData(card));
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
}

export async function createCard(listId: string, title: string): Promise<CardData> {
  try {
    await connectMongo();
    
    const lastCard = await Card.findOne({ listId }).sort({ order: -1 });
    const newOrder = lastCard ? lastCard.order + 1 : 0;
    
    const newCard = new Card({
      _id: new Types.ObjectId(),
      title,
      description: "",
      listId,
      order: newOrder,
    });
    
    await newCard.save();
    return convertCardToData(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
}

export async function updateCard(id: string, data: { title?: string; description?: string }): Promise<void> {
  try {
    await connectMongo();
    await Card.updateOne({ _id: new Types.ObjectId(id) }, data);
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
}

export async function deleteCard(id: string): Promise<void> {
  try {
    await connectMongo();
    await Card.deleteOne({ _id: new Types.ObjectId(id) });
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
