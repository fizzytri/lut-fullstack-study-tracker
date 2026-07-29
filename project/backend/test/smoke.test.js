const test = require('node:test')
const assert = require('node:assert')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')

process.env.JWT_SECRET = 'test_secret_value_for_smoke_tests'
process.env.NODE_ENV = 'test'

const createApp = require('../app')

let mongod
let app
let token
let courseId

test.before(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
  app = createApp()
})

test.after(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

test('health endpoint responds', async () => {
  const res = await request(app).get('/api/health')
  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.status, 'ok')
})

test('registers a user and returns a token', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Test Student', email: 'test@example.com', password: 'password123' })

  assert.strictEqual(res.status, 201)
  assert.ok(res.body.token)
  assert.strictEqual(res.body.email, 'test@example.com')
  token = res.body.token
})

test('rejects duplicate registration', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Other', email: 'test@example.com', password: 'password123' })

  assert.strictEqual(res.status, 400)
})

test('logs in with correct credentials and rejects wrong ones', async () => {
  const ok = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@example.com', password: 'password123' })
  assert.strictEqual(ok.status, 200)

  const bad = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@example.com', password: 'wrongpassword' })
  assert.strictEqual(bad.status, 401)
})

test('blocks protected routes without a token', async () => {
  const res = await request(app).get('/api/courses')
  assert.strictEqual(res.status, 401)
})

test('creates and lists a course', async () => {
  const created = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${token}`)
    .send({ code: 'ct30a3201', name: 'Full-Stack', credits: 3, status: 'active' })

  assert.strictEqual(created.status, 201)
  assert.strictEqual(created.body.code, 'CT30A3201')
  courseId = created.body._id

  const list = await request(app).get('/api/courses').set('Authorization', `Bearer ${token}`)
  assert.strictEqual(list.body.length, 1)
})

test('rejects duplicate course codes for the same user', async () => {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${token}`)
    .send({ code: 'CT30A3201', name: 'Duplicate', credits: 3 })

  assert.strictEqual(res.status, 400)
})

test('logs a session and returns the populated course', async () => {
  const res = await request(app)
    .post('/api/sessions')
    .set('Authorization', `Bearer ${token}`)
    .send({ course: courseId, minutes: 90, activity: 'project', focus: 4 })

  assert.strictEqual(res.status, 201)
  assert.strictEqual(res.body.course.code, 'CT30A3201')
})

test('validates session minutes', async () => {
  const res = await request(app)
    .post('/api/sessions')
    .set('Authorization', `Bearer ${token}`)
    .send({ course: courseId, minutes: 5000 })

  assert.strictEqual(res.status, 500)
})

test('creates a goal and computes progress from sessions', async () => {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 7)

  const res = await request(app)
    .post('/api/goals')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Ship the project', targetMinutes: 180, deadline, course: courseId })

  assert.strictEqual(res.status, 201)

  const list = await request(app).get('/api/goals').set('Authorization', `Bearer ${token}`)
  assert.strictEqual(list.body[0].achievedMinutes, 90)
  assert.strictEqual(list.body[0].progress, 50)
})

test('stats summary aggregates correctly', async () => {
  const res = await request(app)
    .get('/api/stats/summary?days=30')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.totalMinutes, 90)
  assert.strictEqual(res.body.sessions, 1)
  assert.strictEqual(res.body.activeCourses, 1)
  assert.strictEqual(res.body.streak, 1)
  assert.strictEqual(res.body.timeline.length, 30)
  assert.strictEqual(res.body.perCourse[0].code, 'CT30A3201')
})

test('another user cannot touch the first user course', async () => {
  const other = await request(app)
    .post('/api/users')
    .send({ name: 'Intruder', email: 'intruder@example.com', password: 'password123' })

  const res = await request(app)
    .delete(`/api/courses/${courseId}`)
    .set('Authorization', `Bearer ${other.body.token}`)

  assert.strictEqual(res.status, 403)
})

test('deleting a course cascades to sessions and goals', async () => {
  const res = await request(app)
    .delete(`/api/courses/${courseId}`)
    .set('Authorization', `Bearer ${token}`)
  assert.strictEqual(res.status, 200)

  const sessions = await request(app).get('/api/sessions').set('Authorization', `Bearer ${token}`)
  assert.strictEqual(sessions.body.length, 0)

  const goals = await request(app).get('/api/goals').set('Authorization', `Bearer ${token}`)
  assert.strictEqual(goals.body.length, 0)
})

test('unknown route returns 404 json', async () => {
  const res = await request(app).get('/api/nope')
  assert.strictEqual(res.status, 404)
  assert.ok(res.body.message.includes('Not found'))
})
