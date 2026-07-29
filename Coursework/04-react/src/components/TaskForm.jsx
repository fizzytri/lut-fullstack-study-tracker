import { useState } from 'react'

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()

    if (!text.trim()) return

    onAdd(text.trim())
    setText('')
  }

  return (
    <form onSubmit={onSubmit} className="row">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add</button>
    </form>
  )
}

export default TaskForm
