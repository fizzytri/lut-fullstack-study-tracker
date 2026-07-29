const http = require('http')
const { people, averageAge } = require('./people')

const port = process.env.PORT || 4001

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (req.url === '/people' && req.method === 'GET') {
    res.writeHead(200)
    res.end(JSON.stringify({ count: people.length, averageAge: averageAge(people), people }))
    return
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200)
    res.end(JSON.stringify({ message: 'Node core http server, try /people' }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ message: 'Not found' }))
})

server.listen(port, () => console.log(`Core http server listening on http://localhost:${port}`))
