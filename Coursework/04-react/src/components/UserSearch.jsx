import { useState, useEffect } from 'react'

const UserSearch = () => {
  const [query, setQuery] = useState('react')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          'https://api.github.com/search/users?q=' + query + '&per_page=5'
        )

        if (!response.ok) {
          throw new Error('Request failed with status ' + response.status)
        }

        const data = await response.json()
        setUsers(data.items)
      } catch (err) {
        setError(err.message)
      }

      setLoading(false)
    }

    fetchUsers()
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
