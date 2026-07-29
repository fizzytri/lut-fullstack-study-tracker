import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTrash, FaPen } from 'react-icons/fa'
import { fetchCourses, addCourse, editCourse, removeCourse } from '../features/courses/courseSlice'
import Spinner from '../components/Spinner'

const emptyForm = {
  code: '',
  name: '',
  credits: 5,
  semester: 'autumn',
  status: 'planned',
  targetGrade: 3,
  colour: '#4f46e5',
}

const Courses = () => {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const onChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...form,
      credits: Number(form.credits),
      targetGrade: Number(form.targetGrade),
    }

    const action = editingId
      ? await dispatch(editCourse({ id: editingId, payload }))
      : await dispatch(addCourse(payload))

    if (action.meta.requestStatus === 'fulfilled') {
      toast.success(editingId ? 'Course updated' : 'Course added')
      resetForm()
    } else {
      toast.error(action.payload)
    }
  }

  const onEdit = (course) => {
    setEditingId(course._id)
    setForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      semester: course.semester,
      status: course.status,
      targetGrade: course.targetGrade,
      colour: course.colour,
    })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this course and all its sessions?')) return

    const action = await dispatch(removeCourse(id))

    if (action.meta.requestStatus === 'fulfilled') {
      toast.success('Course deleted')
    } else {
      toast.error(action.payload)
    }
  }

  if (isLoading && items.length === 0) return <Spinner />

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Courses</h1>
          <p className="muted">Everything you are studying this year.</p>
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit course' : 'Add a course'}</h2>
        <form onSubmit={onSubmit} className="grid-form">
          <div>
            <label htmlFor="code">Code</label>
            <input id="code" name="code" value={form.code} onChange={onChange} required />
          </div>

          <div className="span-2">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={onChange} required />
          </div>

          <div>
            <label htmlFor="credits">Credits</label>
            <input
              id="credits"
              type="number"
              name="credits"
              min="0"
              max="60"
              value={form.credits}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="semester">Semester</label>
            <select id="semester" name="semester" value={form.semester} onChange={onChange}>
              <option value="autumn">Autumn</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
            </select>
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={onChange}>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetGrade">Target grade</label>
            <input
              id="targetGrade"
              type="number"
              name="targetGrade"
              min="0"
              max="5"
              value={form.targetGrade}
              onChange={onChange}
            />
          </div>

          <div>
            <label htmlFor="colour">Colour</label>
            <input
              id="colour"
              type="color"
              name="colour"
              value={form.colour}
              onChange={onChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Add course'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Your courses ({items.length})</h2>
        {items.length === 0 ? (
          <p className="muted">No courses yet. Add your first one above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <span className="dot" style={{ background: course.colour }} />
                      {course.code}
                    </td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td className="capitalise">{course.semester}</td>
                    <td>
                      <span className={`badge badge-${course.status}`}>{course.status}</span>
                    </td>
                    <td className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => onEdit(course)}>
                        <FaPen />
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => onDelete(course._id)}
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

export default Courses
