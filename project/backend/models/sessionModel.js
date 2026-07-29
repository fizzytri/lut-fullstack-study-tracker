const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please choose a course'],
      ref: 'Course',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    minutes: {
      type: Number,
      required: [true, 'Please add the minutes'],
    },
    activity: {
      type: String,
      enum: ['lecture', 'reading', 'exercise', 'project', 'revision', 'exam'],
      default: 'reading',
    },
    focus: {
      type: Number,
      default: 3,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Session', sessionSchema)
