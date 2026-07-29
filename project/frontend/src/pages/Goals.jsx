import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTrash, FaCheck, FaUndo } from 'react-icons/fa'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../features/goals/goalSlice'
import { getCourses } from '../features/courses/courseSlice'
import Spinner from '../components/Spinner'
import { formatMinutes, formatDate } from '../utils/format'

const twoWeeksFromNow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

const Goals = () => {
  const [formData, setFormData] = useState({
    title: '',
    targetMinutes: 600,
    deadline: twoWeeksFromNow(),
    course: '',
  })

  const dispatch = useDispatch()
  const { goals, isLoading } = useSelector((state) => state.goals)
  const { courses } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(getGoals())
    dispatch(getCourses())
  }, [dispatch])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const goalData = {
      title: formData.title,
      targetMinutes: Number(formData.targetMinutes),
      deadline: formData.deadline,
      course: formData.course || null,
    }

    const result = await dispatch(createGoal(goalData))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Goal created')
      setFormData({ title: '', targetMinutes: 600, deadline: twoWeeksFromNow(), course: '' })
    } else {
      toast.error(result.payload)
    }
  }

  if (isLoading && goals.length === 0) {
    return <Spinner />
  }

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
            <input id="title" name="title" value={formData.title} onChange={onChange} required />
          </div>

          <div>
            <label htmlFor="targetMinutes">Target minutes</label>
            <input
              id="targetMinutes"
              type="number"
              name="targetMinutes"
              min="1"
              value={formData.targetMinutes}
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
              value={formData.deadline}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="goal-course">Course</label>
            <select id="goal-course" name="course" value={formData.course} onChange={onChange}>
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
        {goals.length === 0 ? (
          <p className="muted">No goals yet.</p>
        ) : (
          goals.map((goal) => (
            <article key={goal._id} className={goal.completed ? 'card goal-card done' : 'card goal-card'}>
              <h3>{goal.title}</h3>
              <p className="muted">{goal.course ? goal.course.code : 'All courses'}</p>

              <span className="bar-track">
                <span className="bar-fill" style={{ width: goal.progress + '%' }} />
              </span>

              <p className="muted">
                {formatMinutes(goal.achievedMinutes)} of {formatMinutes(goal.targetMinutes)} (
                {goal.progress}%)
              </p>

              <p className="muted">Due {formatDate(goal.deadline)}</p>

              <div className="row-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    dispatch(
                      updateGoal({ id: goal._id, goalData: { completed: !goal.completed } })
                    )
                  }
                >
                  {goal.completed ? <FaUndo /> : <FaCheck />}
                  {goal.completed ? ' Reopen' : ' Complete'}
                </button>

                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => dispatch(deleteGoal(goal._id))}
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default Goals
