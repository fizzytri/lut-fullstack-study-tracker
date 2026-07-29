import { useState } from 'react'
import Counter from './components/Counter'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import UserSearch from './components/UserSearch'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './components/ThemeContext'

const initialTasks = [
  { id: 1, text: 'Watch the React crash course', done: true },
  { id: 2, text: 'Build the task list with props and state', done: false },
  { id: 3, text: 'Fetch data inside useEffect', done: false },
]

const App = () => {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = (text) =>
    setTasks((prev) => [...prev, { id: Date.now(), text, done: false }])

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))

  const deleteTask = (id) => setTasks((prev) => prev.filter((task) => task.id !== id))

  const remaining = tasks.filter((task) => !task.done).length

  return (
    <ThemeProvider>
      <div className="page">
        <header>
          <h1>React exercises</h1>
          <ThemeToggle />
        </header>

        <section className="card">
          <h2>1. State and events</h2>
          <Counter />
        </section>

        <section className="card">
          <h2>2. Props, lists and lifting state up</h2>
          <p className="muted">{remaining} of {tasks.length} tasks open</p>
          <TaskForm onAdd={addTask} />
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </section>

        <section className="card">
          <h2>3. useEffect and data fetching</h2>
          <UserSearch />
        </section>
      </div>
    </ThemeProvider>
  )
}

export default App
