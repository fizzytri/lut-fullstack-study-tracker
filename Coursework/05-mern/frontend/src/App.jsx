import { useEffect, useState } from 'react'
import api from './api'

const stored = localStorage.getItem('mern-user')

const App = () => {
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [mode, setMode] = useState('login')
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    api
      .get('/notes')
      .then((res) => setNotes(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
  }, [user])

  const onAuth = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const { data } = await api.post(mode === 'login' ? '/users/login' : '/users', payload)
      localStorage.setItem('mern-user', JSON.stringify(data))
      setUser(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const onAddNote = async (event) => {
    event.preventDefault()

    try {
      const { data } = await api.post('/notes', { text })
      setNotes((prev) => [data, ...prev])
      setText('')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const onDelete = async (id) => {
    await api.delete(`/notes/${id}`)
    setNotes((prev) => prev.filter((note) => note._id !== id))
  }

  const onLogout = () => {
    localStorage.removeItem('mern-user')
    setUser(null)
    setNotes([])
  }

  if (!user) {
    return (
      <main style={{ maxWidth: 360, margin: '60px auto', fontFamily: 'system-ui' }}>
        <h1>{mode === 'login' ? 'Log in' : 'Register'}</h1>
        <form onSubmit={onAuth}>
          {mode === 'register' && (
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account?' : 'Have an account?'}
        </button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 520, margin: '60px auto', fontFamily: 'system-ui' }}>
      <h1>Notes of {user.name}</h1>
      <button type="button" onClick={onLogout}>
        Log out
      </button>

      <form onSubmit={onAddNote}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New note" required />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            {note.text} <button type="button" onClick={() => onDelete(note._id)}>x</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
