const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    weeklyTargetMinutes: user.weeklyTargetMinutes,
    token: generateToken(user._id),
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const user = await User.findOne({ email })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    weeklyTargetMinutes: user.weeklyTargetMinutes,
    token: generateToken(user._id),
  })
})

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user)
})

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (req.body.name) {
    user.name = req.body.name
  }

  if (req.body.weeklyTargetMinutes) {
    user.weeklyTargetMinutes = req.body.weeklyTargetMinutes
  }

  await user.save()

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    weeklyTargetMinutes: user.weeklyTargetMinutes,
  })
})

module.exports = { registerUser, loginUser, getMe, updateMe }
