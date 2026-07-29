const mongoose = require('mongoose')

const courseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a course code'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Course code cannot be longer than 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Please add a course name'],
      trim: true,
      maxlength: [120, 'Course name cannot be longer than 120 characters'],
    },
    credits: {
      type: Number,
      required: [true, 'Please add the number of credits'],
      min: [0, 'Credits cannot be negative'],
      max: [60, 'Credits cannot exceed 60'],
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
    targetGrade: {
      type: Number,
      min: [0, 'Grade cannot be below 0'],
      max: [5, 'Grade cannot be above 5'],
      default: 3,
    },
    colour: {
      type: String,
      default: '#4f46e5',
      match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Colour must be a hex value'],
    },
  },
  { timestamps: true }
)

courseSchema.index({ user: 1, code: 1 }, { unique: true })

module.exports = mongoose.model('Course', courseSchema)
