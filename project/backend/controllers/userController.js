const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  })

const publicProfile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  weeklyTargetMinutes: user.weeklyTargetMinutes,
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide a name, email and password')
  }

  const exists = await User.findOne({ email: email.toLowerCase() })

  if (exists) {
    res.status(400)
    throw new Error('An account with that email already exists')
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({ ...publicProfile(user), token: generateToken(user._id) })
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide an email and password')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({ ...publicProfile(user), token: generateToken(user._id) })
})

const getMe = asyncHandler(async (req, res) => {
  res.json(publicProfile(req.user))
})

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.name = req.body.name ?? user.name
  user.weeklyTargetMinutes = req.body.weeklyTargetMinutes ?? user.weeklyTargetMinutes

  const updated = await user.save()

  res.json(publicProfile(updated))
})

module.exports = { registerUser, loginUser, getMe, updateMe }
