const asyncHandler = require('express-async-handler')
const Course = require('../models/courseModel')
const Session = require('../models/sessionModel')
const Goal = require('../models/goalModel')

const getCourses = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }

  if (req.query.status) {
    filter.status = req.query.status
  }

  const courses = await Course.find(filter).sort({ createdAt: -1 })

  res.json(courses)
})

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    res.status(404)
    throw new Error('Course not found')
  }

  if (course.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to view this course')
  }

  res.json(course)
})

const createCourse = asyncHandler(async (req, res) => {
  const { code, name, credits, semester, status, targetGrade, colour } = req.body

  if (!code || !name || credits === undefined) {
    res.status(400)
    throw new Error('Please provide a code, name and credits')
  }

  const duplicate = await Course.findOne({
    user: req.user._id,
    code: code.toUpperCase(),
  })

  if (duplicate) {
    res.status(400)
    throw new Error('You already have a course with that code')
  }

  const course = await Course.create({
    user: req.user._id,
    code,
    name,
    credits,
    semester,
    status,
    targetGrade,
    colour,
  })

  res.status(201).json(course)
})

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    res.status(404)
    throw new Error('Course not found')
  }

  if (course.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to update this course')
  }

  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.json(updated)
})

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    res.status(404)
    throw new Error('Course not found')
  }

  if (course.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorised to delete this course')
  }

  await Session.deleteMany({ course: course._id })
  await Goal.deleteMany({ course: course._id })
  await course.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse }
