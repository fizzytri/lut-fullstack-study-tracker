const asyncHandler = require('express-async-handler')
const Session = require('../models/sessionModel')
const Course = require('../models/courseModel')

const toDateString = (date) => new Date(date).toISOString().slice(0, 10)

const getSummary = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30

  const since = new Date()
  since.setHours(0, 0, 0, 0)
  since.setDate(since.getDate() - (days - 1))

  const sessions = await Session.find({
    user: req.user.id,
    date: { $gte: since },
  }).populate('course', 'code name colour')

  let totalMinutes = 0
  let totalFocus = 0

  const minutesPerDay = {}
  const minutesPerCourse = {}
  const minutesPerActivity = {}

  sessions.forEach((session) => {
    totalMinutes = totalMinutes + session.minutes
    totalFocus = totalFocus + session.focus

    const day = toDateString(session.date)
    minutesPerDay[day] = (minutesPerDay[day] || 0) + session.minutes

    if (session.course) {
      const code = session.course.code

      if (!minutesPerCourse[code]) {
        minutesPerCourse[code] = { code, colour: session.course.colour, minutes: 0 }
      }

      minutesPerCourse[code].minutes = minutesPerCourse[code].minutes + session.minutes
    }

    minutesPerActivity[session.activity] =
      (minutesPerActivity[session.activity] || 0) + session.minutes
  })

  const timeline = []

  for (let i = 0; i < days; i++) {
    const day = new Date(since)
    day.setDate(day.getDate() + i)

    const key = toDateString(day)
    timeline.push({ date: key, minutes: minutesPerDay[key] || 0 })
  }

  let streak = 0
  const dayToCheck = new Date()
  dayToCheck.setHours(0, 0, 0, 0)

  while (minutesPerDay[toDateString(dayToCheck)]) {
    streak++
    dayToCheck.setDate(dayToCheck.getDate() - 1)
  }

  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - 6)

  let weekMinutes = 0

  sessions.forEach((session) => {
    if (session.date >= weekStart) {
      weekMinutes = weekMinutes + session.minutes
    }
  })

  const target = req.user.weeklyTargetMinutes || 0
  let weeklyProgress = 0

  if (target > 0) {
    weeklyProgress = Math.round((weekMinutes / target) * 100)

    if (weeklyProgress > 100) {
      weeklyProgress = 100
    }
  }

  const activeCourses = await Course.countDocuments({ user: req.user.id, status: 'active' })

  let averageFocus = 0

  if (sessions.length > 0) {
    averageFocus = Math.round((totalFocus / sessions.length) * 10) / 10
  }

  res.json({
    rangeDays: days,
    totalMinutes,
    sessions: sessions.length,
    averageFocus,
    activeCourses,
    streak,
    weekMinutes,
    weeklyTargetMinutes: target,
    weeklyProgress,
    timeline,
    perCourse: Object.values(minutesPerCourse).sort((a, b) => b.minutes - a.minutes),
    perActivity: Object.keys(minutesPerActivity)
      .map((activity) => ({ activity, minutes: minutesPerActivity[activity] }))
      .sort((a, b) => b.minutes - a.minutes),
  })
})

module.exports = { getSummary }
