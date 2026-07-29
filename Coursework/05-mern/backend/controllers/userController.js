const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  if (await User.findOne({ email })) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const user = await User.create({ name, email, password: await bcrypt.hash(password, salt) })

  res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user.id) })
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  res.json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user.id) })
})

const getMe = asyncHandler(async (req, res) => res.json(req.user))

module.exports = { registerUser, loginUser, getMe }
