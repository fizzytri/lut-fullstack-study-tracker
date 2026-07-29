require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coursework'

const connect = async () => {
  await mongoose.connect(uri)
  console.log(`Connected to ${mongoose.connection.name}`)
}

const disconnect = () => mongoose.connection.close()

module.exports = { connect, disconnect, mongoose }
