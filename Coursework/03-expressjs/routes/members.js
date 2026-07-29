const express = require('express')
const router = express.Router()
const { members, takeId } = require('../data')
const validateMember = require('../middleware/validateMember')

router.get('/', (req, res) => {
  const { status, limit } = req.query
  let result = members

  if (status) {
    result = result.filter((member) => member.status === status)
  }

  if (limit) {
    result = result.slice(0, Number(limit))
  }

  res.json(result)
})

router.get('/:id', (req, res) => {
  const member = members.find((item) => item.id === Number(req.params.id))

  if (!member) {
    return res.status(404).json({ message: `Member ${req.params.id} not found` })
  }

  res.json(member)
})

router.post('/', validateMember, (req, res) => {
  const member = {
    id: takeId(),
    name: req.body.name,
    email: req.body.email,
    status: req.body.status || 'active',
  }

  members.push(member)
  res.status(201).json(member)
})

router.put('/:id', validateMember, (req, res) => {
  const member = members.find((item) => item.id === Number(req.params.id))

  if (!member) {
    return res.status(404).json({ message: `Member ${req.params.id} not found` })
  }

  member.name = req.body.name
  member.email = req.body.email
  member.status = req.body.status || member.status

  res.json(member)
})

router.delete('/:id', (req, res) => {
  const index = members.findIndex((item) => item.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).json({ message: `Member ${req.params.id} not found` })
  }

  const [removed] = members.splice(index, 1)
  res.json(removed)
})

module.exports = router
