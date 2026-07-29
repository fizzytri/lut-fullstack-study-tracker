const path = require('path')
const express = require('express')
const cors = require('cors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const createApp = () => {
  const app = express()

  app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))

  app.use('/api/users', require('./routes/userRoutes'))
  app.use('/api/courses', require('./routes/courseRoutes'))
  app.use('/api/sessions', require('./routes/sessionRoutes'))
  app.use('/api/goals', require('./routes/goalRoutes'))
  app.use('/api/stats', require('./routes/statsRoutes'))

  if (process.env.NODE_ENV === 'production') {
    const clientBuild = path.join(__dirname, '..', 'frontend', 'dist')
    app.use(express.static(clientBuild))
    app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')))
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
