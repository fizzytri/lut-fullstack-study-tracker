const asyncHandler = require('express-async-handler')
const Session = require('../models/sessionModel')
const Course = require('../models/courseModel')

const getSessions = asyncHandler(async (req, res) => {
  const filter = { user: req.user.id }

  if (req.query.course) {
    filter.course = req.query.course
  }

  const sessions = await Session.find(filter)
    .populate('course', 'code name colour')
    .sort({ date: -1 })

  res.json(sessions)
})

const createSession = asyncHandler(async (req, res) => {
  const { course, minutes } = req.body

  if (!course || !minutes) {
    res.status(400)
    throw new Error('Please add a course and the minutes')
  }

  if (minutes < 1 || minutes > 1440) {
    res.status(400)
    throw new Error('Minutes must be between 1 and 1440')
  }

  const chosenCourse = await Course.findById(course)

  if (!chosenCourse || chosenCourse.user.toString() !== req.user.id) {
    res.status(400)
    throw new Error('Course not found')
  }

  const session = await Session.create({
    user: req.user.id,
    course,
    minutes,
    date: req.body.date || Date.now(),
    activity: req.body.activity,
    focus: req.body.focus,
    notes: req.body.notes,
  })

  await session.populate('course', 'code name colour')

  res.status(201).json(session)
})

const updateSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(404)
    throw new Error('Session not found')
  }

  if (session.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('course', 'code name colour')

  res.json(updatedSession)
})

const deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(404)
    throw new Error('Session not found')
  }

  if (session.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  await session.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getSessions, createSession, updateSession, deleteSession }
