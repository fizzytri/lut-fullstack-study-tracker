require('dotenv').config()
require('colors')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User = require('./models/userModel')
const Course = require('./models/courseModel')
const Session = require('./models/sessionModel')
const Goal = require('./models/goalModel')

const activities = ['lecture', 'reading', 'exercise', 'project', 'revision']

const run = async () => {
  await connectDB()

  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Session.deleteMany(),
    Goal.deleteMany(),
  ])

  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@studytracker.dev',
    password: 'demopassword',
    weeklyTargetMinutes: 720,
  })

  const courses = await Course.create([
    {
      user: user._id,
      code: 'CT30A3201',
      name: 'Software Development Skills: Full-Stack',
      credits: 3,
      status: 'active',
      colour: '#4f46e5',
    },
    {
      user: user._id,
      code: 'CT30A2910',
      name: 'Introduction to Data Structures',
      credits: 6,
      status: 'active',
      colour: '#059669',
    },
    {
      user: user._id,
      code: 'A130A0550',
      name: 'Business Analytics',
      credits: 6,
      status: 'planned',
      colour: '#d97706',
    },
  ])

  const sessions = []

  for (let day = 0; day < 30; day += 1) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    const count = day % 5 === 0 ? 0 : 1 + (day % 2)

    for (let i = 0; i < count; i += 1) {
      sessions.push({
        user: user._id,
        course: courses[(day + i) % courses.length]._id,
        date,
        minutes: 40 + ((day * 13 + i * 25) % 90),
        activity: activities[(day + i) % activities.length],
        focus: 2 + ((day + i) % 4),
        notes: '',
      })
    }
  }

  await Session.insertMany(sessions)

  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 14)

  await Goal.create([
    {
      user: user._id,
      course: courses[0]._id,
      title: 'Finish the MERN module',
      targetMinutes: 900,
      deadline,
    },
    {
      user: user._id,
      title: 'Study 20 hours this sprint',
      targetMinutes: 1200,
      deadline,
    },
  ])

  console.log('Seed data created. Login with demo@studytracker.dev / demopassword'.green.bold)
  await mongoose.connection.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
