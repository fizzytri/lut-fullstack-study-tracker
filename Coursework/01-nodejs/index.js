const os = require('os')
const path = require('path')
const Logger = require('./logger')
const { people, averageAge } = require('./people')
const { writeReport, readReport, streamReport } = require('./fileTasks')

const logger = new Logger()

logger.on('message', (event) => console.log(`[${event.at}] ${event.message}`))

const main = async () => {
  logger.log(`Running on ${os.platform()} with ${os.cpus().length} CPU cores`)
  logger.log(`Current directory: ${path.basename(__dirname)}`)

  people.forEach((person) => logger.log(person.greeting()))
  logger.log(`Average age: ${averageAge(people)}`)

  const lines = people.map((person) => `${person.name};${person.age};${person.email}`).join('\n')
  const file = await writeReport(`name;age;email\n${lines}\n`)
  logger.log(`Report written to ${file}`)

  const content = await readReport()
  logger.log(`Report has ${content.trim().split('\n').length} lines`)

  let chunks = 0
  streamReport(() => {
    chunks += 1
  }).on('end', () => logger.log(`Report streamed in ${chunks} chunks`))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
