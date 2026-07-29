import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaTrash, FaPen } from 'react-icons/fa'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../features/courses/courseSlice'
import Spinner from '../components/Spinner'

const emptyForm = {
  code: '',
  name: '',
  credits: 5,
  semester: 'autumn',
  status: 'planned',
  colour: '#4f46e5',
}

const Courses = () => {
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const dispatch = useDispatch()
  const { courses, isLoading } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(getCourses())
  }, [dispatch])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const courseData = { ...formData, credits: Number(formData.credits) }

    let result

    if (editingId) {
      result = await dispatch(updateCourse({ id: editingId, courseData }))
    } else {
      result = await dispatch(createCourse(courseData))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingId ? 'Course updated' : 'Course added')
      resetForm()
    } else {
      toast.error(result.payload)
    }
  }

  const onEdit = (course) => {
    setEditingId(course._id)
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits,
      semester: course.semester,
      status: course.status,
      colour: course.colour,
    })
  }

  const onDelete = (id) => {
    if (window.confirm('Delete this course and all its sessions?')) {
      dispatch(deleteCourse(id))
    }
  }

  if (isLoading && courses.length === 0) {
    return <Spinner />
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Courses</h1>
          <p className="muted">Everything you are studying.</p>
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit course' : 'Add a course'}</h2>

        <form onSubmit={onSubmit} className="grid-form">
          <div>
            <label htmlFor="code">Code</label>
            <input id="code" name="code" value={formData.code} onChange={onChange} required />
          </div>

          <div className="span-2">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={onChange} required />
          </div>

          <div>
            <label htmlFor="credits">Credits</label>
            <input
              id="credits"
              type="number"
              name="credits"
              min="0"
              value={formData.credits}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="semester">Semester</label>
            <select id="semester" name="semester" value={formData.semester} onChange={onChange}>
              <option value="autumn">Autumn</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
            </select>
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={onChange}>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div>
            <label htmlFor="colour">Colour</label>
            <input
              id="colour"
              type="color"
              name="colour"
              value={formData.colour}
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
        <h2>Your courses ({courses.length})</h2>

        {courses.length === 0 ? (
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <span className="dot" style={{ background: course.colour }} />
                      {course.code}
                    </td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td className="capitalise">{course.semester}</td>
                    <td className="capitalise">{course.status}</td>
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
