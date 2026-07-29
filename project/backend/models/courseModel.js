const mongoose = require('mongoose')

const courseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    code: {
      type: String,
      required: [true, 'Please add a course code'],
    },
    name: {
      type: String,
      required: [true, 'Please add a course name'],
    },
    credits: {
      type: Number,
      required: [true, 'Please add the credits'],
    },
    semester: {
      type: String,
      enum: ['autumn', 'spring', 'summer'],
      default: 'autumn',
    },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'dropped'],
      default: 'planned',
    },
    colour: {
      type: String,
      default: '#4f46e5',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Course', courseSchema)
