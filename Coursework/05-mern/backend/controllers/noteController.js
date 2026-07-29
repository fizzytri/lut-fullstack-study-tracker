const asyncHandler = require('express-async-handler')
const Note = require('../models/noteModel')

const getNotes = asyncHandler(async (req, res) => {
  res.json(await Note.find({ user: req.user.id }).sort({ createdAt: -1 }))
})

const setNote = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  res.status(201).json(await Note.create({ text: req.body.text, user: req.user.id }))
})

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('User not authorised')
  }

  res.json(await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('User not authorised')
  }

  await note.deleteOne()
  res.json({ id: req.params.id })
})

module.exports = { getNotes, setNote, updateNote, deleteNote }
