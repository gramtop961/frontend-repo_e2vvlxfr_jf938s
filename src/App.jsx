import { useEffect, useState } from 'react'
import UserSwitcher from './components/UserSwitcher'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    // Try to restore from localStorage
    const cached = localStorage.getItem('vibechat_user')
    if (cached) setCurrentUser(JSON.parse(cached))
  }, [])

  useEffect(() => {
    if (currentUser) localStorage.setItem('vibechat_user', JSON.stringify(currentUser))
  }, [currentUser])

  const createDemoDM = async () => {
    if (!currentUser) return alert('Create/select a user first')
    // Ensure a Bob user exists (or create)
    let bob = null
    try {
      const usersRes = await fetch(`${apiBase}/api/users?q=Bob`)
      const users = await usersRes.json()
      bob = users.find(u => u.name.toLowerCase() === 'bob')
      if (!bob) {
        const res = await fetch(`${apiBase}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Bob' })
        })
        bob = await res.json()
      }
    } catch (e) {
      console.error(e)
    }

    try {
      const res = await fetch(`${apiBase}/api/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: [currentUser.id, bob.id], is_group: false })
      })
      const chat = await res.json()
      setSelectedChat(chat)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-stretch">
      <div className="w-[360px] border-r bg-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b bg-emerald-600 text-white">VibeChat</div>
        <UserSwitcher currentUser={currentUser} onChange={setCurrentUser} />
        <ChatList currentUser={currentUser} selectedChat={selectedChat} onSelect={setSelectedChat} onCreateDm={createDemoDM} />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow currentUser={currentUser} chat={selectedChat} />
      </div>
    </div>
  )
}
