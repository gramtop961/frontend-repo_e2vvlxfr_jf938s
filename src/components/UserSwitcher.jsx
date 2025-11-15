import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function UserSwitcher({ currentUser, onChange }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async (q = '') => {
    try {
      const res = await fetch(`${apiBase}/api/users${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      const data = await res.json()
      setUsers(data)
    } catch (e) {
      console.error(e)
    }
  }

  const createUser = async (n) => {
    const displayName = n || name
    if (!displayName) return
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName })
      })
      const user = await res.json()
      onChange(user)
      setName('')
      await loadUsers()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-b bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          {currentUser ? (
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-semibold truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">ID: {currentUser.id}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No user selected</p>
          )}
        </div>
        <button
          onClick={() => createUser('Alice')}
          className="text-xs px-3 py-1.5 rounded bg-emerald-500 text-white hover:bg-emerald-600"
        >
          New Alice
        </button>
        <button
          onClick={() => createUser('Bob')}
          className="text-xs px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          New Bob
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Create user by name..."
          className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={loading}
          onClick={() => createUser()}
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}
