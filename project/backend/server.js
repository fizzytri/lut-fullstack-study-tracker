const path = require('path')
const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/sessions', require('./routes/sessionRoutes'))
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/stats', require('./routes/statsRoutes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  )
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`.yellow.bold))
