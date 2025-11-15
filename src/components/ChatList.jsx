import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ChatList({ currentUser, selectedChat, onSelect, onCreateDm }) {
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (currentUser?.id) {
      loadChats()
    }
  }, [currentUser?.id])

  const loadChats = async () => {
    try {
      const res = await fetch(`${apiBase}/api/chats?user_id=${currentUser.id}`)
      const data = await res.json()
      setChats(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 && (
        <div className="p-6 text-sm text-gray-500">No chats yet. Start a conversation!</div>
      )}
      {chats.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 ${selectedChat?.id === c.id ? 'bg-gray-50' : ''}`}
        >
          <div className="font-medium truncate">{c.title || (c.participants.length === 2 ? 'Direct Message' : 'Group')}</div>
          <div className="text-xs text-gray-500 truncate">{c.participants.join(', ')}</div>
        </button>
      ))}
      <div className="p-4">
        <button
          onClick={onCreateDm}
          className="w-full px-3 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
        >
          New DM with Bob (demo)
        </button>
      </div>
    </div>
  )
}
