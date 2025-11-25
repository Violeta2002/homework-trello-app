// app/page.tsx
export const dynamic = 'force-dynamic';

import { getBoards } from "@/app/actions/boardActions";
import BoardList from "@/app/components/BoardList";

export default async function Home() {
  const boardsInitial = await getBoards();
  return <BoardList boardsInitial={boardsInitial} />;
}

