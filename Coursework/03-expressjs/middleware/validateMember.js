const validateMember = (req, res, next) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ message: 'Please include a name and email' })
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please include a valid email' })
  }

  next()
}

module.exports = validateMember
