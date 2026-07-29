const path = require('path')
const express = require('express')
const logger = require('./middleware/logger')

const app = express()
const port = process.env.PORT || 4003

app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/members', require('./routes/members'))

app.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error' })
})

app.listen(port, () => console.log(`Express server on http://localhost:${port}`))
