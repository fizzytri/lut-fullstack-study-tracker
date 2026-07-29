const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please add a goal title'],
      trim: true,
      maxlength: [120, 'Title cannot be longer than 120 characters'],
    },
    targetMinutes: {
      type: Number,
      required: [true, 'Please add a target in minutes'],
      min: [1, 'Target must be at least 1 minute'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Goal', goalSchema)
