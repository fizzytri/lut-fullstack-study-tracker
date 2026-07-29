const EventEmitter = require('events')
const { randomUUID } = require('crypto')

class Logger extends EventEmitter {
  log(message) {
    this.emit('message', { id: randomUUID(), message, at: new Date().toISOString() })
  }
}

module.exports = Logger
