const asyncHandler = require('express-async-handler')
const Course = require('../models/courseModel')
const Session = require('../models/sessionModel')
const Goal = require('../models/goalModel')

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 })

  res.json(courses)
})

const createCourse = asyncHandler(async (req, res) => {
  const { code, name, credits } = req.body

  if (!code || !name || !credits) {
    res.status(400)
    throw new Error('Please add a code, name and credits')
  }

  const courseExists = await Course.findOne({
    user: req.user.id,
    code: code.toUpperCase(),
  })

  if (courseExists) {
    res.status(400)
    throw new Error('You already have a course with that code')
  }

  const course = await Course.create({
    user: req.user.id,
    code: code.toUpperCase(),
    name,
    credits,
    semester: req.body.semester,
    status: req.body.status,
    colour: req.body.colour,
  })

  res.status(201).json(course)
})

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    res.status(404)
    throw new Error('Course not found')
  }

  if (course.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.json(updatedCourse)
})

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    res.status(404)
    throw new Error('Course not found')
  }

  if (course.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized')
  }

  await Session.deleteMany({ course: course.id })
  await Goal.deleteMany({ course: course.id })
  await course.deleteOne()

  res.json({ id: req.params.id })
})

module.exports = { getCourses, createCourse, updateCourse, deleteCourse }
