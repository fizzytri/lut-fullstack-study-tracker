require('dotenv').config()
require('colors')
const connectDB = require('./config/db')
const createApp = require('./app')

const port = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  const app = createApp()
  app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold))
}

start()
