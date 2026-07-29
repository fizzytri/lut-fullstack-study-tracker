const { mongoose } = require('./connect')

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, default: 'Finland' },
})

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    genres: [{ type: String }],
    year: { type: Number, min: 1400, max: 2100 },
    pages: { type: Number, min: 1 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
)

bookSchema.virtual('isLong').get(function () {
  return this.pages > 400
})

const Author = mongoose.model('Author', authorSchema)
const Book = mongoose.model('Book', bookSchema)

module.exports = { Author, Book }
