import api from '../../app/api'

const getCourses = async () => {
  const { data } = await api.get('/courses')
  return data
}

const createCourse = async (payload) => {
  const { data } = await api.post('/courses', payload)
  return data
}

const updateCourse = async (id, payload) => {
  const { data } = await api.put(`/courses/${id}`, payload)
  return data
}

const deleteCourse = async (id) => {
  const { data } = await api.delete(`/courses/${id}`)
  return data
}

export default { getCourses, createCourse, updateCourse, deleteCourse }
