import { useEffect, useRef, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ChatWindow({ currentUser, chat }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (chat?.id) {
      loadMessages()
      const i = setInterval(loadMessages, 1500)
      return () => clearInterval(i)
    }
  }, [chat?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      const res = await fetch(`${apiBase}/api/messages?chat_id=${chat.id}`)
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      console.error(e)
    }
  }

  const send = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat.id, sender_id: currentUser.id, content: text })
      })
      const msg = await res.json()
      setText('')
      setMessages((prev) => [...prev, msg])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-white/70 backdrop-blur">
        <div className="font-semibold">{chat.title || 'Conversation'}</div>
        <div className="text-xs text-gray-500">{chat.participants.length} participant(s)</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-lg ${m.sender_id === currentUser.id ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-white border'}`}>
            <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
            <div className={`text-[10px] mt-1 ${m.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(m.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={loading}
          onClick={send}
          className="px-4 py-2 rounded-full bg-blue-600 text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
