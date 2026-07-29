import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTrash, FaCheck, FaUndo } from 'react-icons/fa'
import { fetchGoals, addGoal, toggleGoal, removeGoal } from '../features/goals/goalSlice'
import { fetchCourses } from '../features/courses/courseSlice'
import Spinner from '../components/Spinner'
import { formatMinutes, formatDate, daysUntil } from '../utils/format'

const defaultDeadline = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

const Goals = () => {
  const [form, setForm] = useState({
    title: '',
    targetMinutes: 600,
    deadline: defaultDeadline(),
    course: '',
  })

  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.goals)
  const { items: courses } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(fetchGoals())
    dispatch(fetchCourses())
  }, [dispatch])

  const onChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()

    const action = await dispatch(
      addGoal({ ...form, targetMinutes: Number(form.targetMinutes), course: form.course || null })
    )

    if (action.meta.requestStatus === 'fulfilled') {
      toast.success('Goal created')
      setForm({ title: '', targetMinutes: 600, deadline: defaultDeadline(), course: '' })
    } else {
      toast.error(action.payload)
    }
  }

  if (isLoading && items.length === 0) return <Spinner />

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Goals</h1>
          <p className="muted">Targets keep the streak alive.</p>
        </div>
      </div>

      <div className="card">
        <h2>New goal</h2>
        <form onSubmit={onSubmit} className="grid-form">
          <div className="span-2">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={onChange} required />
          </div>

          <div>
            <label htmlFor="targetMinutes">Target minutes</label>
            <input
              id="targetMinutes"
              type="number"
              name="targetMinutes"
              min="1"
              value={form.targetMinutes}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="goal-course">Course</label>
            <select id="goal-course" name="course" value={form.course} onChange={onChange}>
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add goal
            </button>
          </div>
        </form>
      </div>

      <div className="goal-grid">
        {items.length === 0 ? (
          <p className="muted">No goals yet.</p>
        ) : (
          items.map((goal) => {
            const left = daysUntil(goal.deadline)

            return (
              <article key={goal._id} className={`card goal-card ${goal.completed ? 'done' : ''}`}>
                <header>
                  <h3>{goal.title}</h3>
                  <span className="muted">{goal.course ? goal.course.code : 'All courses'}</span>
                </header>

                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${goal.progress}%` }} />
                </span>

                <p className="muted">
                  {formatMinutes(goal.achievedMinutes)} of {formatMinutes(goal.targetMinutes)} ({goal.progress}%)
                </p>

                <p className="muted">
                  Due {formatDate(goal.deadline)}
                  {!goal.completed && (left >= 0 ? ` - ${left} days left` : ' - overdue')}
                </p>

                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => dispatch(toggleGoal({ id: goal._id, completed: !goal.completed }))}
                  >
                    {goal.completed ? <FaUndo /> : <FaCheck />}
                    {goal.completed ? ' Reopen' : ' Complete'}
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => dispatch(removeGoal(goal._id))}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default Goals
