const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const User = require('./models/userModel')
const Course = require('./models/courseModel')
const Session = require('./models/sessionModel')
const Goal = require('./models/goalModel')

const activities = ['lecture', 'reading', 'exercise', 'project', 'revision']

const seed = async () => {
  await connectDB()

  await User.deleteMany()
  await Course.deleteMany()
  await Session.deleteMany()
  await Goal.deleteMany()

  const salt = await bcrypt.genSalt(10)

  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@studytracker.dev',
    password: await bcrypt.hash('demopassword', salt),
    weeklyTargetMinutes: 720,
  })

  const courses = await Course.create([
    {
      user: user.id,
      code: 'CT30A3201',
      name: 'Software Development Skills: Full-Stack',
      credits: 3,
      status: 'active',
      colour: '#4f46e5',
    },
    {
      user: user.id,
      code: 'CT30A2910',
      name: 'Introduction to Data Structures',
      credits: 6,
      status: 'active',
      colour: '#059669',
    },
    {
      user: user.id,
      code: 'A130A0550',
      name: 'Business Analytics',
      credits: 6,
      status: 'planned',
      colour: '#d97706',
    },
  ])

  for (let day = 0; day < 30; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    if (day % 5 !== 0) {
      await Session.create({
        user: user.id,
        course: courses[day % courses.length].id,
        date,
        minutes: 40 + ((day * 13) % 90),
        activity: activities[day % activities.length],
        focus: 2 + (day % 4),
      })
    }
  }

  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 14)

  await Goal.create([
    {
      user: user.id,
      course: courses[0].id,
      title: 'Finish the MERN module',
      targetMinutes: 900,
      deadline,
    },
    {
      user: user.id,
      title: 'Study 20 hours this sprint',
      targetMinutes: 1200,
      deadline,
    },
  ])

  console.log('Seed data created'.green.bold)
  console.log('Login with demo@studytracker.dev / demopassword')

  process.exit()
}

seed()
