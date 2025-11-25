// app/components/BoardList.tsx
"use client";
import { useState } from "react";
import { createBoard, updateBoard, deleteBoard, type BoardData } from "@/app/actions/boardActions";
import Link from "next/link";

interface BoardListProps {
  boardsInitial: BoardData[];
}

export default function BoardList({ boardsInitial }: BoardListProps) {
  const [boards, setBoards] = useState<BoardData[]>(boardsInitial);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      const newBoard = await createBoard(newBoardName.trim());
      setBoards([newBoard, ...boards]);
      setNewBoardName("");
      setIsCreating(false);
    }
  };

  const handleUpdateBoard = async (id: string, name: string) => {
    await updateBoard(id, name);
    setBoards(boards.map(board => 
      board._id === id ? { ...board, name } : board
    ));
  };

  const handleDeleteBoard = async (id: string) => {
    await deleteBoard(id);
    setBoards(boards.filter(board => board._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Boards</h1>
        
        {isCreating ? (
          <form onSubmit={handleCreateBoard} className="mb-6">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Add board title"
              className="w-full p-3 border border-gray-300 rounded-lg"
              autoFocus
            />
            <div className="mt-2 space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Board
              </button>
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg mb-6"
          >
            + Create new board
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onUpdate={handleUpdateBoard}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BoardCard({ 
  board, 
  onUpdate, 
  onDelete 
}: { 
  board: BoardData;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(board.name);

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(board._id, name.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(board.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 h-24 relative flex flex-col">
      {isEditing ? (
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-none text-white outline-none mb-2"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleSubmit}
              className="bg-white text-green-500 px-2 py-1 rounded text-xs"
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link href={`/board/${board._id}`} className="flex-1 block">
            <span className="font-semibold block h-full flex items-center">
              {board.name}
            </span>
          </Link>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-green-200 text-xs bg-blue-600 px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(board._id);
              }}
              className="text-white hover:text-red-200 text-xs bg-red-600 px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}