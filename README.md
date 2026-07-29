# LUT Software Development Skills: Full-Stack

My coursework and project for the LUT anytime course
*Software Development Skills: Full-Stack (2025-26)*.

- `Coursework/` - the exercises I did while going through the five tutorial modules
- `project/` - Study Tracker, my MERN project
- `VIDEO.md` - link to a video of it running

## Study Tracker

An app for keeping track of how much I actually study. You add your courses, log study sessions
against them, set goals, and the dashboard shows where the time went.

You can register and log in, add and edit courses, log sessions with the minutes, activity type
and a focus rating, and set goals with a deadline. The dashboard shows your total time, a study
streak, progress against a weekly target, and a chart of minutes per day.

Built with MongoDB, Express, React and Node, plus Redux Toolkit for the state and Recharts for
the chart.

## How to run it

You need Node.js and MongoDB installed.

**1. Install the packages**

```bash
git clone https://github.com/fizzytri/lut-fullstack-study-tracker.git
cd lut-fullstack-study-tracker
npm run install-all
```

**2. Make the .env file**

Go to `project/backend`, copy `.env.example` to `.env` and open it. It needs:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studytracker
JWT_SECRET=some_long_random_string
```

`JWT_SECRET` can be anything as long as it is long and you don't share it.

**3. Add demo data (optional)**

```bash
npm run seed
```

This empties the database and adds a demo account with a month of sessions:
`demo@studytracker.dev` / `demopassword`

**4. Start it**

Two terminals, both in the main folder:

```bash
npm run server
npm run client
```

Then open http://localhost:5173

## Things I would do better

- The stats endpoint loads all the sessions and adds them up in JavaScript. It works, but doing
  the counting in the database with aggregation would be faster with a lot of data.
- I have no automated tests. I tested everything by clicking through it in the browser.
- The token is saved in localStorage because that is what the tutorial does. I have read that a
  httpOnly cookie is safer.

