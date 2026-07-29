# LUT Software Development Skills: Full-Stack

Coursework and final project for the LUT anytime course
**Software Development Skills: Full-Stack (2025-26)**.

| Folder | Contents |
| --- | --- |
| [`Coursework/`](Coursework) | Exercise projects coded along with the five tutorial modules |
| [`project/`](project) | **Study Tracker** - the MERN project |
| [`VIDEO.md`](VIDEO.md) | Link to the demo video of the project running |

---

## The project: Study Tracker

A MERN application for logging study time, tracking courses and hitting weekly targets.
It is not the course example project: the domain, data model, statistics API and UI are original.
The MERN patterns practised in `Coursework/05-mern` (JWT auth, protected routes, ownership checks)
are reused here, as the course material allows.

### Features

- **Authentication** - register and log in, passwords hashed with bcrypt, JWT bearer tokens,
  protected React routes and protected API routes
- **Courses** - full CRUD, per-user unique course codes, credits, semester, status, colour tag
- **Study sessions** - log minutes against a course with activity type, focus rating and notes;
  filter the history by course
- **Goals** - set a minute target and a deadline, optionally scoped to one course; progress is
  computed server-side from the sessions inside the goal window
- **Dashboard** - MongoDB aggregation pipelines produce a daily timeline, time per course, an
  activity split, average focus, a current study streak and weekly-target progress; charts drawn
  with Recharts
- **Profile** - editable name and weekly study target

### Tech stack

| Layer | Choices |
| --- | --- |
| Database | MongoDB, Mongoose 8 (schema validation, refs, indexes, aggregation) |
| API | Node.js 18+, Express 4, JWT, bcryptjs, express-async-handler, central error middleware |
| Client | React 18, Vite, Redux Toolkit, React Router 6, Axios, Recharts, React Toastify |

### Architecture

```
project/
├── backend/
│   ├── config/db.js            Mongoose connection
│   ├── models/                 User, Course, Session, Goal
│   ├── controllers/            Request handling + ownership checks
│   ├── routes/                 Express routers, protect applied per router
│   ├── middleware/             JWT auth, 404 and error handler
│   ├── app.js                  Express app factory (used by server and tests)
│   ├── server.js               Entry point
│   └── seed.js                 Demo data
└── frontend/
    └── src/
        ├── app/                Redux store, axios instance with token interceptor
        ├── features/           auth, courses, sessions, goals, stats slices + services
        ├── components/         Header, PrivateRoute, StatCard, Spinner
        ├── pages/              Dashboard, Courses, Sessions, Goals, Login, Register, Profile
        └── utils/format.js
```

---

## Running the project

### Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Install dependencies

```bash
git clone <this-repository-url>
cd <repository-folder>
npm run install-all
```

Or install each side separately:

```bash
cd project/backend  && npm install
cd ../frontend      && npm install
```

### 2. Configure the backend

```bash
cd project/backend
cp .env.example .env
```

Then edit `.env`:

```ini
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studytracker
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

### 3. Optional: load demo data

```bash
npm run seed --prefix project/backend
```

Creates a demo account with 30 days of sessions:

```
email:    demo@studytracker.dev
password: demopassword
```

### 4. Start both servers

Two terminals from the repository root:

```bash
npm run server     # API   -> http://localhost:5000
npm run client     # React -> http://localhost:5173
```

Open <http://localhost:5173>. Vite proxies `/api` to port 5000, so no CORS setup is needed
in development.

### Production build

```bash
npm run build                                   # builds project/frontend/dist
NODE_ENV=production npm run server              # Express serves the built client
```

---

## API reference

All routes are prefixed with `/api`. Everything except register, login and health requires an
`Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Service status |
| POST | `/users` | Register, returns the user and a token |
| POST | `/users/login` | Log in, returns the user and a token |
| GET | `/users/me` | Current user |
| PUT | `/users/me` | Update name and weekly target |
| GET | `/courses` | List courses, optional `?status=` |
| POST | `/courses` | Create a course |
| GET | `/courses/:id` | Single course |
| PUT | `/courses/:id` | Update a course |
| DELETE | `/courses/:id` | Delete a course and its sessions and goals |
| GET | `/sessions` | List sessions, optional `?course=`, `?from=`, `?to=`, `?limit=` |
| POST | `/sessions` | Log a session |
| PUT | `/sessions/:id` | Update a session |
| DELETE | `/sessions/:id` | Delete a session |
| GET | `/goals` | List goals with computed progress |
| POST | `/goals` | Create a goal |
| PUT | `/goals/:id` | Update a goal |
| DELETE | `/goals/:id` | Delete a goal |
| GET | `/stats/summary` | Dashboard aggregation, optional `?days=` (default 30) |

Errors return `{ "message": "..." }` with `400` for validation, `401` for authentication,
`403` for ownership and `404` for missing documents.

---

## Tests

The backend ships an integration test suite that boots the Express app against an in-memory
MongoDB instance and covers registration, login, token protection, ownership rules, CRUD,
cascade deletes and the statistics aggregation.

```bash
npm test --prefix project/backend
```

The first run downloads a `mongod` binary via `mongodb-memory-server`, so it needs internet
access. On a machine where that download is blocked, point `MONGOMS_SYSTEM_BINARY` at a local
`mongod` instead.

---

## Coursework

`Coursework/` holds the exercise projects from the tutorial series, one folder per module,
each with its own `NOTES.md` and run instructions. See
[`Coursework/README.md`](Coursework/README.md).

---

## Attribution

- The MERN example project from the course material
  (<https://github.com/bradtraversy/mern-tutorial>) and the Express crash course source
  (<https://github.com/bradtraversy/express-crash>) were followed for the exercise modules.
  The course grants permission to reuse this example code.
- The Study Tracker application code is original work built on those patterns.
