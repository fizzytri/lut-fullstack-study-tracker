import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import { getSessions, createSession, deleteSession } from '../features/sessions/sessionSlice'
import { getCourses } from '../features/courses/courseSlice'
import Spinner from '../components/Spinner'
import { formatMinutes, formatDate } from '../utils/format'

const today = new Date().toISOString().slice(0, 10)

const emptyForm = {
  course: '',
  date: today,
  minutes: 60,
  activity: 'reading',
  focus: 3,
  notes: '',
}

const Sessions = () => {
  const [formData, setFormData] = useState(emptyForm)
  const [filter, setFilter] = useState('')

  const dispatch = useDispatch()
  const { sessions, isLoading } = useSelector((state) => state.sessions)
  const { courses } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(getCourses())
  }, [dispatch])

  useEffect(() => {
    dispatch(getSessions(filter))
  }, [dispatch, filter])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const sessionData = {
      ...formData,
      minutes: Number(formData.minutes),
      focus: Number(formData.focus),
    }

    const result = await dispatch(createSession(sessionData))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Session logged')
      setFormData({ ...emptyForm, course: formData.course })
    } else {
      toast.error(result.payload)
    }
  }

  let totalMinutes = 0

  sessions.forEach((session) => {
    totalMinutes = totalMinutes + session.minutes
  })

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Study sessions</h1>
          <p className="muted">{formatMinutes(totalMinutes)} in the list below.</p>
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.code}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <h2>Log a session</h2>

        {courses.length === 0 ? (
          <p className="muted">Add a course first, then you can log sessions for it.</p>
        ) : (
          <form onSubmit={onSubmit} className="grid-form">
            <div className="span-2">
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={onChange}
                required
              >
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date">Date</label>
              <input id="date" type="date" name="date" value={formData.date} onChange={onChange} />
            </div>

            <div>
              <label htmlFor="minutes">Minutes</label>
              <input
                id="minutes"
                type="number"
                name="minutes"
                min="1"
                max="1440"
                value={formData.minutes}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label htmlFor="activity">Activity</label>
              <select id="activity" name="activity" value={formData.activity} onChange={onChange}>
                <option value="lecture">Lecture</option>
                <option value="reading">Reading</option>
                <option value="exercise">Exercise</option>
                <option value="project">Project</option>
                <option value="revision">Revision</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <div>
              <label htmlFor="focus">Focus: {formData.focus} / 5</label>
              <input
                id="focus"
                type="range"
                name="focus"
                min="1"
                max="5"
                value={formData.focus}
                onChange={onChange}
              />
            </div>

            <div className="span-3">
              <label htmlFor="notes">Notes</label>
              <input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={onChange}
                placeholder="What did you work on?"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Log session
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>History</h2>

        {isLoading ? (
          <Spinner />
        ) : sessions.length === 0 ? (
          <p className="muted">Nothing logged yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Activity</th>
                  <th>Time</th>
                  <th>Focus</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{formatDate(session.date)}</td>
                    <td>
                      <span className="dot" style={{ background: session.course.colour }} />
                      {session.course.code}
                    </td>
                    <td className="capitalise">{session.activity}</td>
                    <td>{formatMinutes(session.minutes)}</td>
                    <td>{session.focus}/5</td>
                    <td className="notes-cell">{session.notes}</td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => dispatch(deleteSession(session._id))}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Sessions
