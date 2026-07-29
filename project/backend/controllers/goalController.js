const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const Session = require('../models/sessionModel')

const withProgress = async (goal, userId) => {
  const match = {
    user: userId,
    date: { $gte: goal.createdAt, $lte: goal.deadline },
  }

  if (goal.course) {
    match.course = goal.course._id || goal.course
  }

  const [result] = await Session.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$minutes' } } },
  ])

  const achievedMinutes = result ? result.total : 0

  return {
    ...goal.toObject(),
    achievedMinutes,
    progress: Math.min(Math.round((achievedMinutes / goal.targetMinutes) * 100), 100),
  }
}

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id })
    .populate('course', 'code name colour')
    .sort({ deadline: 1 })

  const enriched = await Promise.all(goals.map((goal) => withProgress(goal, req.user._id)))

  res.json(enriched)
})

const createGoal = asyncHandler(async (req, res) => {
  const { title, targetMinutes, deadline, course } = req.body

  if (!title || !targetMinutes || !deadline) {
    res.status(400)
    throw new Error('Please provide a title, target and deadline')
  }

  const goal = await Goal.create({
    user: req.user._id,
    title,
    targetMinutes,
    deadline,
    course: course || null,
  })

  const populated = await goal.populate('course', 'code name colour')

  res.status(201).json(await withProgress(populated, req.user._id))
})

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to update this goal')
  }

  const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('course', 'code name colour')

  res.json(await withProgress(updated, req.user._id))
})

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(404)
    throw new Error('Goal not found')
  }

  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to delete this goal')
  }

  await goal.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getGoals, createGoal, updateGoal, deleteGoal }
