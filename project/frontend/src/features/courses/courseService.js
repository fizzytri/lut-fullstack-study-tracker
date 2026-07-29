import axios from 'axios'

const API_URL = '/api/courses/'

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

const getCourses = async (token) => {
  const response = await axios.get(API_URL, getConfig(token))
  return response.data
}

const createCourse = async (courseData, token) => {
  const response = await axios.post(API_URL, courseData, getConfig(token))
  return response.data
}

const updateCourse = async (id, courseData, token) => {
  const response = await axios.put(API_URL + id, courseData, getConfig(token))
  return response.data
}

const deleteCourse = async (id, token) => {
  const response = await axios.delete(API_URL + id, getConfig(token))
  return response.data
}

const courseService = { getCourses, createCourse, updateCourse, deleteCourse }

export default courseService
