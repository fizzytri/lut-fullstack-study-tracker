const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer')) {
    res.status(401)
    throw new Error('Not authorised, no token provided')
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      res.status(401)
      throw new Error('Not authorised, user no longer exists')
    }

    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not authorised, token failed')
  }
})

module.exports = { protect }
