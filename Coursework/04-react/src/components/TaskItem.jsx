const TaskItem = ({ task, onToggle, onDelete }) => (
  <li className={task.done ? 'done' : ''}>
    <label>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      {task.text}
    </label>
    <button type="button" className="ghost" onClick={() => onDelete(task.id)}>
      Delete
    </button>
  </li>
)

export default TaskItem
