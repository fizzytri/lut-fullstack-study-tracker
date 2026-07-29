const { connect, disconnect } = require('./connect')
const { Book } = require('./models')

const run = async () => {
  await connect()

  const byAuthor = await Book.aggregate([
    { $group: { _id: '$author', books: { $sum: 1 }, avgRating: { $avg: '$rating' }, pages: { $sum: '$pages' } } },
    { $lookup: { from: 'authors', localField: '_id', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
    { $project: { _id: 0, author: '$author.name', books: 1, pages: 1, avgRating: { $round: ['$avgRating', 2] } } },
    { $sort: { books: -1 } },
  ])

  console.table(byAuthor)

  const byGenre = await Book.aggregate([
    { $unwind: '$genres' },
    { $group: { _id: '$genres', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  console.table(byGenre)

  const byDecade = await Book.aggregate([
    { $group: { _id: { $multiply: [{ $floor: { $divide: ['$year', 10] } }, 10] }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])

  console.table(byDecade)

  await disconnect()
}

run().catch(async (error) => {
  console.error(error)
  await disconnect()
  process.exit(1)
})
