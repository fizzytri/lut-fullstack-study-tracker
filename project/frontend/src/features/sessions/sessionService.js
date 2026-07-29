import axios from 'axios'

const API_URL = '/api/sessions/'

const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

const getSessions = async (courseId, token) => {
  let url = API_URL

  if (courseId) {
    url = API_URL + '?course=' + courseId
  }

  const response = await axios.get(url, getConfig(token))
  return response.data
}

const createSession = async (sessionData, token) => {
  const response = await axios.post(API_URL, sessionData, getConfig(token))
  return response.data
}

const deleteSession = async (id, token) => {
  const response = await axios.delete(API_URL + id, getConfig(token))
  return response.data
}

const sessionService = { getSessions, createSession, deleteSession }

export default sessionService
