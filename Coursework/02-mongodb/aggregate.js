const { connect, disconnect } = require('./connect')
const { Book } = require('./models')

const run = async () => {
  await connect()

  const byAuthor = await Book.aggregate([
    {
      $group: {
        _id: '$author',
        books: { $sum: 1 },
        pages: { $sum: '$pages' },
        avgRating: { $avg: '$rating' },
      },
    },
    { $sort: { books: -1 } },
  ])

  console.log('Books per author:')
  console.log(byAuthor)

  const byGenre = await Book.aggregate([
    { $unwind: '$genres' },
    { $group: { _id: '$genres', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  console.log('Books per genre:')
  console.log(byGenre)

  await disconnect()
}

run()
