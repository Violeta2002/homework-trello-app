// app/components/BoardView.tsx
"use client";
import { useState, useEffect } from "react";
import { type BoardData } from "@/app/actions/boardActions";
import { type ListData, getLists, createList, updateList, deleteList } from "@/app/actions/listActions";
import { type CardData, getCards, createCard, updateCard, deleteCard } from "@/app/actions/cardActions";
import Link from "next/link";

interface BoardViewProps {
  board: BoardData;
  listsInitial: ListData[];
}

export default function BoardView({ board, listsInitial }: BoardViewProps) {
  const [lists, setLists] = useState<ListData[]>(listsInitial);
  const [cards, setCards] = useState<{ [listId: string]: CardData[] }>({});
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    const loadCards = async () => {
      const cardsData: { [listId: string]: CardData[] } = {};
      for (const list of lists) {
        const listCards = await getCards(list._id);
        cardsData[list._id] = listCards;
      }
      setCards(cardsData);
    };
    loadCards();
  }, [lists]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = await createList(board._id, newListName.trim());
      setLists([...lists, newList]);
      setNewListName("");
      setIsCreatingList(false);
    }
  };

  const handleUpdateList = async (id: string, name: string) => {
    await updateList(id, name);
    setLists(lists.map(list => 
      list._id === id ? { ...list, name } : list
    ));
  };

  const handleDeleteList = async (id: string) => {
    await deleteList(id);
    setLists(lists.filter(list => list._id !== id));
  };

  const handleCreateCard = async (listId: string, title: string) => {
    const newCard = await createCard(listId, title);
    setCards(prev => ({
      ...prev,
      [listId]: [...(prev[listId] || []), newCard]
    }));
  };

  const handleUpdateCard = async (cardId: string, data: { title?: string; description?: string }) => {
    await updateCard(cardId, data);
    const updatedCards: { [listId: string]: CardData[] } = {};
    for (const list of lists) {
      updatedCards[list._id] = await getCards(list._id);
    }
    setCards(updatedCards);
  };

  const handleDeleteCard = async (cardId: string, listId: string) => {
    await deleteCard(cardId);
    setCards(prev => ({
      ...prev,
      [listId]: (prev[listId] || []).filter(card => card._id !== cardId)
    }));
  };

  return (
    <div className="min-h-screen bg-blue-500 p-4">
      <div className="max-w-full mx-auto">
        <div className="flex items-center mb-4">
          <Link 
            href="/" 
            className="text-white hover:bg-blue-600 p-2 rounded mr-2"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">{board.name}</h1>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists.map((list) => (
            <ListView
              key={list._id}
              list={list}
              cards={cards[list._id] || []}
              onUpdate={handleUpdateList}
              onDelete={handleDeleteList}
              onCreateCard={handleCreateCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
          
          {isCreatingList ? (
            <div className="bg-gray-100 p-3 rounded-lg w-64 h-fit">
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list title..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                    Add List
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingList(false)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    ×
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingList(true)}
              className="bg-gray-100 bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg w-64 h-fit whitespace-nowrap"
            >
              + Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ListView({ 
  list, 
  cards, 
  onUpdate, 
  onDelete, 
  onCreateCard, 
  onUpdateCard, 
  onDeleteCard 
}: { 
  list: ListData;
  cards: CardData[];
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onCreateCard: (listId: string, title: string) => void;
  onUpdateCard: (cardId: string, data: { title?: string; description?: string }) => void;
  onDeleteCard: (cardId: string, listId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(list._id, name.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(list.name);
    setIsEditing(false);
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      await onCreateCard(list._id, newCardTitle.trim());
      setNewCardTitle("");
      setIsCreatingCard(false);
    }
  };

  return (
    <div className="bg-gray-100 p-3 rounded-lg w-64 h-fit">
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-semibold text-sm p-1 mb-1 border border-gray-300 rounded"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="flex gap-1">
              <button 
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
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
            <h3 className="font-semibold text-sm flex-1">{list.name}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700 text-xs bg-gray-200 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(list._id)}
                className="text-gray-500 hover:text-gray-700 text-xs bg-gray-200 px-2 py-1 rounded"
              >
                ×
              </button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-2 mb-2">
        {cards.map((card) => (
          <CardView
            key={card._id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={() => onDeleteCard(card._id, list._id)}
          />
        ))}
      </div>

      {isCreatingCard ? (
        <form onSubmit={handleCreateCard}>
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
              Add Card
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreatingCard(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              ×
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingCard(true)}
          className="text-gray-600 hover:bg-gray-200 p-2 rounded w-full text-left text-sm"
        >
          + Add a card
        </button>
      )}
    </div>
  );
}

function CardView({ 
  card, 
  onUpdate, 
  onDelete 
}: { 
  card: CardData;
  onUpdate: (cardId: string, data: { title?: string; description?: string }) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState(card.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onUpdate(card._id, { title: title.trim() });
      setIsEditing(false);
    }
  };

  const handleTitleCancel = () => {
    setTitle(card.title);
    setIsEditing(false);
  };

  const handleSaveDescription = async () => {
    setIsSaving(true);
    await onUpdate(card._id, { description: description.trim() });
    setIsSaving(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await onUpdate(card._id, { 
      title: title.trim(), 
      description: description.trim() 
    });
    setIsSaving(false);
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white p-2 rounded shadow-sm cursor-pointer hover:bg-gray-50">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm mb-1 border border-gray-300 rounded p-1"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
            />
            <div className="flex gap-1">
              <button 
                onClick={handleTitleSubmit}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Save
              </button>
              <button 
                onClick={handleTitleCancel}
                className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div 
              className="text-sm font-medium mb-1"
              onClick={() => setShowModal(true)}
            >
              {card.title}
            </div>
            {card.description && (
              <div 
                className="text-xs text-gray-500 mb-1 line-clamp-2"
                onClick={() => setShowModal(true)}
              >
                {card.description}
              </div>
            )}
            <div className="flex justify-between items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-gray-500 hover:text-gray-700 text-xs bg-gray-100 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-500 hover:text-red-700 text-xs bg-red-100 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">Card Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Card
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}