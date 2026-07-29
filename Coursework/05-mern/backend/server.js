require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { errorHandler } = require('./middleware/errorMiddleware')

const port = process.env.PORT || 4005

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/notes', require('./routes/noteRoutes'))
app.use(errorHandler)

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern-exercise')
  .then(() => app.listen(port, () => console.log(`MERN exercise API on port ${port}`)))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
