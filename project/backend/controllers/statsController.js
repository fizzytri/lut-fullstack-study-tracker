const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Session = require('../models/sessionModel')
const Course = require('../models/courseModel')

const startOfDay = (date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const getSummary = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id)
  const days = Math.min(Number(req.query.days) || 30, 365)

  const since = startOfDay(new Date())
  since.setDate(since.getDate() - (days - 1))

  const perDay = await Session.aggregate([
    { $match: { user: userId, date: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        minutes: { $sum: '$minutes' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const perCourse = await Session.aggregate([
    { $match: { user: userId, date: { $gte: since } } },
    { $group: { _id: '$course', minutes: { $sum: '$minutes' }, sessions: { $sum: 1 } } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $project: {
        _id: 0,
        courseId: '$course._id',
        code: '$course.code',
        name: '$course.name',
        colour: '$course.colour',
        minutes: 1,
        sessions: 1,
      },
    },
    { $sort: { minutes: -1 } },
  ])

  const perActivity = await Session.aggregate([
    { $match: { user: userId, date: { $gte: since } } },
    { $group: { _id: '$activity', minutes: { $sum: '$minutes' } } },
    { $sort: { minutes: -1 } },
  ])

  const [totals] = await Session.aggregate([
    { $match: { user: userId, date: { $gte: since } } },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: '$minutes' },
        sessions: { $sum: 1 },
        averageFocus: { $avg: '$focus' },
      },
    },
  ])

  const weekStart = startOfDay(new Date())
  weekStart.setDate(weekStart.getDate() - 6)

  const [week] = await Session.aggregate([
    { $match: { user: userId, date: { $gte: weekStart } } },
    { $group: { _id: null, minutes: { $sum: '$minutes' } } },
  ])

  const activeCourses = await Course.countDocuments({ user: userId, status: 'active' })

  const dayMap = new Map(perDay.map((entry) => [entry._id, entry.minutes]))
  const timeline = []

  for (let i = 0; i < days; i += 1) {
    const day = new Date(since)
    day.setDate(day.getDate() + i)
    const key = day.toISOString().slice(0, 10)
    timeline.push({ date: key, minutes: dayMap.get(key) || 0 })
  }

  const studiedDays = [...dayMap.keys()].sort()
  let streak = 0
  const cursor = startOfDay(new Date())

  while (studiedDays.includes(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const weekMinutes = week ? week.minutes : 0
  const target = req.user.weeklyTargetMinutes || 0

  res.json({
    rangeDays: days,
    totalMinutes: totals ? totals.totalMinutes : 0,
    sessions: totals ? totals.sessions : 0,
    averageFocus: totals ? Number(totals.averageFocus.toFixed(2)) : 0,
    activeCourses,
    streak,
    weekMinutes,
    weeklyTargetMinutes: target,
    weeklyProgress: target ? Math.min(Math.round((weekMinutes / target) * 100), 100) : 0,
    timeline,
    perCourse,
    perActivity: perActivity.map((entry) => ({ activity: entry._id, minutes: entry.minutes })),
  })
})

module.exports = { getSummary }
