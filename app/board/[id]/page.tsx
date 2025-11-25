// app/board/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { getBoard } from "@/app/actions/boardActions";
import { getLists } from "@/app/actions/listActions";
import BoardView from "@/app/components/BoardView";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function BoardPage({ params }: PageProps) {
  try {
    const board = await getBoard(params.id);
    const lists = await getLists(params.id);
    
    return <BoardView board={board} listsInitial={lists} />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}