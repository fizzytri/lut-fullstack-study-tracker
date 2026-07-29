const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const Session = require('../models/sessionModel')

const addProgress = (goal, sessions) => {
  const goalStart = new Date(goal.createdAt)
  goalStart.setHours(0, 0, 0, 0)

  let achievedMinutes = 0

  sessions.forEach((session) => {
    const inTime = session.date >= goalStart && session.date <= goal.deadline
    const rightCourse =
      goal.course === null || session.course.toString() === goal.course._id.toString()

    if (inTime && rightCourse) {
      achievedMinutes = achievedMinutes + session.minutes
    }
  })

  let progress = Math.round((achievedMinutes / goal.targetMinutes) * 100)

  if (progress > 100) {
    progress = 100
  }

  return { ...goal.toObject(), achievedMinutes, progress }
}

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id })
    .populate('course', 'code name colour')
    .sort({ deadline: 1 })

  const sessions = await Session.find({ user: req.user.id })

  res.json(goals.map((goal) => addProgress(goal, sessions)))
})

const createGoal = asyncHandler(async (req, res) => {
  const { title, targetMinutes, deadline } = req.body

  if (!title || !targetMinutes || !deadline) {
    res.status(400)
    throw new Error('Please add a title, target and deadline')
  }

  const goal = await Goal.create({
    user: req.user.id,
    title,
    targetMinutes,
    deadline,
    course: req.body.course || null,
  })

  await goal.populate('course', 'code name colour')

  res.status(201).json({ ...goal.toObject(), achievedMinutes: 0, progress: 0 })
})

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('course', 'code name colour')

  const sessions = await Session.find({ user: req.user.id })

  res.json(addProgress(updatedGoal, sessions))
})

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  await goal.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getGoals, createGoal, updateGoal, deleteGoal }
