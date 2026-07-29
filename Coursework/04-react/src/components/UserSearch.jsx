import { useState, useEffect } from 'react'

const UserSearch = () => {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query.trim().length < 2) {
      setUsers([])
      return undefined
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const res = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=5`,
          { signal: controller.signal }
        )

        if (!res.ok) throw new Error(`Request failed with ${res.status}`)

        const data = await res.json()
        setUsers(data.items || [])
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search GitHub users"
      />

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar_url} alt="" width="28" height="28" />
            <a href={user.html_url} target="_blank" rel="noreferrer">
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserSearch
