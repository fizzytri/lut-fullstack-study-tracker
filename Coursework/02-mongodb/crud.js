const { connect, disconnect } = require('./connect')
const { Author, Book } = require('./models')

const run = async () => {
  await connect()

  await Book.deleteMany()
  await Author.deleteMany()

  const [tove, arto] = await Author.create([
    { name: 'Tove Jansson' },
    { name: 'Arto Paasilinna' },
  ])

  await Book.create([
    { title: 'Comet in Moominland', author: tove._id, genres: ['fantasy'], year: 1946, pages: 192, rating: 4.4 },
    { title: 'Finn Family Moomintroll', author: tove._id, genres: ['fantasy'], year: 1948, pages: 170, rating: 4.5 },
    { title: 'The Year of the Hare', author: arto._id, genres: ['satire'], year: 1975, pages: 208, rating: 4.1 },
    { title: 'The Howling Miller', author: arto._id, genres: ['satire', 'drama'], year: 1981, pages: 424, rating: 3.9 },
  ])

  const all = await Book.find().populate('author', 'name')
  console.log(`Created ${all.length} books`)

  const highlyRated = await Book.find({ rating: { $gte: 4.2 } }).select('title rating').sort({ rating: -1 })
  console.log('Rated 4.2 or higher:', highlyRated.map((book) => book.title))

  const satire = await Book.find({ genres: 'satire' }).countDocuments()
  console.log(`Satire books: ${satire}`)

  await Book.updateOne({ title: 'The Year of the Hare' }, { $set: { rating: 4.3 } })
  const updated = await Book.findOne({ title: 'The Year of the Hare' })
  console.log(`Updated rating: ${updated.rating}`)

  const long = await Book.findOne({ pages: { $gt: 400 } })
  console.log(`${long.title} is long: ${long.isLong}`)

  await Book.deleteOne({ title: 'The Howling Miller' })
  console.log(`Books left: ${await Book.countDocuments()}`)

  await disconnect()
}

run().catch(async (error) => {
  console.error(error)
  await disconnect()
  process.exit(1)
})
