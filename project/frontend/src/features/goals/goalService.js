import api from '../../app/api'

const getGoals = async () => {
  const { data } = await api.get('/goals')
  return data
}

const createGoal = async (payload) => {
  const { data } = await api.post('/goals', payload)
  return data
}

const updateGoal = async (id, payload) => {
  const { data } = await api.put(`/goals/${id}`, payload)
  return data
}

const deleteGoal = async (id) => {
  const { data } = await api.delete(`/goals/${id}`)
  return data
}

export default { getGoals, createGoal, updateGoal, deleteGoal }
