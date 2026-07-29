# LUT Software Development Skills: Full-Stack

My coursework and project for the LUT anytime course
*Software Development Skills: Full-Stack (2025-26)*.

- `Coursework/` - the exercise projects I did while going through the five tutorial modules
- `project/` - **Study Tracker**, the MERN project
- `VIDEO.md` - link to the video of the project running

## The project: Study Tracker

An app for keeping track of how much I actually study. You add your courses, log study sessions
against them, set goals, and the dashboard shows where the time went.

I picked this instead of extending the example project because I wanted something I would use
myself, and because the dashboard gave me a reason to practise fetching and combining data
rather than just listing it.

### What it does

- Register and log in. Passwords are hashed with bcrypt and the API hands back a JWT.
- Add, edit and delete courses (code, name, credits, semester, status, a colour).
- Log study sessions on a course: minutes, date, activity type, a focus rating and notes.
  The session list can be filtered by course.
- Set goals with a minute target and a deadline, either for one course or for everything.
  The API adds up the matching sessions to work out the progress.
- A dashboard with total time, session count, study streak, weekly target progress, a bar chart
  of minutes per day, and breakdowns per course and per activity.
- A profile page for changing your name and your weekly target.

### Built with

- **MongoDB + Mongoose** for the database
- **Express** for the API
- **React** with **Redux Toolkit**, React Router, Axios, Recharts and React Toastify
- **Vite** for the dev server and the build

### How the folders are organised

```
project/
├── backend/
│   ├── config/db.js        connects to MongoDB
│   ├── models/             User, Course, Session, Goal
│   ├── controllers/        what each route actually does
│   ├── routes/             the URLs
│   ├── middleware/         checks the JWT, handles errors
│   ├── server.js           starts everything
│   └── seed.js             fills the database with demo data
└── frontend/src/
    ├── app/store.js        the Redux store
    ├── features/           one folder per thing: auth, courses, sessions, goals, stats
    ├── components/         Header, Spinner, StatCard, PrivateRoute
    ├── pages/              Dashboard, Courses, Sessions, Goals, Login, Register, Profile
    └── utils/format.js
```

Each `features/` folder has a `Service` file that talks to the API with axios, and a `Slice` file
with the Redux state and the thunks.

## Running it

You need Node.js and MongoDB (either installed locally or a free MongoDB Atlas database).

### 1. Install

```bash
git clone https://github.com/fizzytri/lut-fullstack-study-tracker.git
cd lut-fullstack-study-tracker
npm run install-all
```

That runs `npm install` in both `project/backend` and `project/frontend`. You can also do it
by hand:

```bash
cd project/backend
npm install
cd ../frontend
npm install
```

### 2. Make the .env file

In `project/backend`, copy `.env.example` to `.env` and fill it in:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studytracker
JWT_SECRET=some_long_random_string
```

`JWT_SECRET` can be anything, it just needs to be long and not shared.

### 3. Demo data (optional)

```bash
npm run seed
```

This wipes the database and creates a demo account with a month of sessions:

```
demo@studytracker.dev / demopassword
```

### 4. Start it

Two terminals, both from the repo root:

```bash
npm run server    # API on http://localhost:5000
npm run client    # app on http://localhost:5173
```

Then open http://localhost:5173. The Vite dev server forwards `/api` to port 5000, so you don't
have to worry about CORS while developing.

## The API

Everything is under `/api`. All of it needs an `Authorization: Bearer <token>` header except
register and login.

| Method | Route | What it does |
| --- | --- | --- |
| POST | `/users` | register |
| POST | `/users/login` | log in |
| GET | `/users/me` | the logged in user |
| PUT | `/users/me` | update name / weekly target |
| GET | `/courses` | list courses |
| POST | `/courses` | add a course |
| PUT | `/courses/:id` | edit a course |
| DELETE | `/courses/:id` | delete a course and its sessions and goals |
| GET | `/sessions` | list sessions, `?course=<id>` to filter |
| POST | `/sessions` | log a session |
| PUT | `/sessions/:id` | edit a session |
| DELETE | `/sessions/:id` | delete a session |
| GET | `/goals` | list goals with their progress |
| POST | `/goals` | add a goal |
| PUT | `/goals/:id` | edit a goal |
| DELETE | `/goals/:id` | delete a goal |
| GET | `/stats/summary` | the dashboard numbers, `?days=7` or `?days=30` |

Errors come back as `{ "message": "..." }`.

## Things I would improve

- The stats endpoint loads all the sessions in the range and adds them up in JavaScript.
  That is fine for one student, but doing it with aggregation on the database would scale better.
- There are no automated tests. I tested everything by hand in the browser.
- The token sits in localStorage, which is what the tutorial does, but I read that a httpOnly
  cookie is safer.

## Credit

I followed the tutorials linked in the Moodle course, mainly the MERN example project
(https://github.com/bradtraversy/mern-tutorial) and the Express crash course
(https://github.com/bradtraversy/express-crash). The course says the example code can be reused.
The Study Tracker itself is my own, built with the patterns from those tutorials.
