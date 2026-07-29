let nextId = 4

const members = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', status: 'active' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com', status: 'inactive' },
  { id: 3, name: 'Grace Hopper', email: 'grace@example.com', status: 'active' },
]

const takeId = () => nextId++

module.exports = { members, takeId }
