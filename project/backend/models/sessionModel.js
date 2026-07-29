const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please choose a course'],
      ref: 'Course',
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
    minutes: {
      type: Number,
      required: [true, 'Please add the studied minutes'],
      min: [1, 'A session must be at least 1 minute'],
      max: [1440, 'A session cannot be longer than 24 hours'],
    },
    activity: {
      type: String,
      enum: ['lecture', 'reading', 'exercise', 'project', 'revision', 'exam'],
      default: 'reading',
    },
    focus: {
      type: Number,
      min: [1, 'Focus rating must be between 1 and 5'],
      max: [5, 'Focus rating must be between 1 and 5'],
      default: 3,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be longer than 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
)

sessionSchema.index({ user: 1, date: -1 })

module.exports = mongoose.model('Session', sessionSchema)
