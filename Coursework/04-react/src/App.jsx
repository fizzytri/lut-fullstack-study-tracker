import { useState } from 'react'
import Counter from './components/Counter'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import UserSearch from './components/UserSearch'

const initialTasks = [
  { id: 1, text: 'Watch the React crash course', done: true },
  { id: 2, text: 'Build the task list with props and state', done: false },
  { id: 3, text: 'Fetch data inside useEffect', done: false },
]

const App = () => {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = (text) => {
    const newTask = { id: Date.now(), text: text, done: false }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, done: !task.done }
        }

        return task
      })
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const remaining = tasks.filter((task) => !task.done).length

  return (
    <div className="page">
      <h1>React exercises</h1>

      <section className="card">
        <h2>1. State and events</h2>
        <Counter />
      </section>

      <section className="card">
        <h2>2. Props, lists and lifting state up</h2>
        <p className="muted">
          {remaining} of {tasks.length} tasks open
        </p>
        <TaskForm onAdd={addTask} />
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </section>

      <section className="card">
        <h2>3. useEffect and fetching data</h2>
        <UserSearch />
      </section>
    </div>
  )
}

export default App
