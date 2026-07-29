const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const dataDir = path.join(__dirname, 'data')

const writeReport = async (content) => {
  await fsPromises.mkdir(dataDir, { recursive: true })
  const file = path.join(dataDir, 'report.txt')
  await fsPromises.writeFile(file, content)
  return file
}

const readReport = async () => fsPromises.readFile(path.join(dataDir, 'report.txt'), 'utf8')

const streamReport = (onChunk) => {
  const stream = fs.createReadStream(path.join(dataDir, 'report.txt'), {
    encoding: 'utf8',
    highWaterMark: 32,
  })

  stream.on('data', onChunk)
  return stream
}

module.exports = { writeReport, readReport, streamReport, dataDir }
