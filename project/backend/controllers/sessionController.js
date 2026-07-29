const asyncHandler = require('express-async-handler')
const Session = require('../models/sessionModel')
const Course = require('../models/courseModel')

const assertOwnCourse = async (courseId, userId, res) => {
  const course = await Course.findById(courseId)

  if (!course || course.user.toString() !== userId.toString()) {
    res.status(400)
    throw new Error('Course not found for this user')
  }

  return course
}

const getSessions = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }

  if (req.query.course) {
    filter.course = req.query.course
  }

  if (req.query.from || req.query.to) {
    filter.date = {}
    if (req.query.from) filter.date.$gte = new Date(req.query.from)
    if (req.query.to) filter.date.$lte = new Date(req.query.to)
  }

  const limit = Math.min(Number(req.query.limit) || 100, 500)

  const sessions = await Session.find(filter)
    .populate('course', 'code name colour')
    .sort({ date: -1 })
    .limit(limit)

  res.json(sessions)
})

const createSession = asyncHandler(async (req, res) => {
  const { course, minutes, date, activity, focus, notes } = req.body

  if (!course || !minutes) {
    res.status(400)
    throw new Error('Please provide a course and the studied minutes')
  }

  await assertOwnCourse(course, req.user._id, res)

  const session = await Session.create({
    user: req.user._id,
    course,
    minutes,
    date: date || Date.now(),
    activity,
    focus,
    notes,
  })

  const populated = await session.populate('course', 'code name colour')

  res.status(201).json(populated)
})

const updateSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(404)
    throw new Error('Session not found')
  }

  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to update this session')
  }

  if (req.body.course) {
    await assertOwnCourse(req.body.course, req.user._id, res)
  }

  const updated = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('course', 'code name colour')

  res.json(updated)
})

const deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(404)
    throw new Error('Session not found')
  }

  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to delete this session')
  }

  await session.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getSessions, createSession, updateSession, deleteSession }
