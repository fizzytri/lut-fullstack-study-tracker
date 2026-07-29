# Module 5 - MERN stack

Notes from following the MERN example project playlist.
Tutorial source code: https://github.com/bradtraversy/mern-tutorial

This folder is the exercise version - one `Note` resource with login, wired from database to UI.
I kept it small on purpose, because the full app I built from these lessons is the Study Tracker
in `/project`.

## What I practised

- Splitting the repo into `backend` and `frontend` with a Vite proxy in development
- `express-async-handler` and one error handler, instead of try/catch everywhere
- Registering and logging in, hashing passwords with bcrypt, signing a JWT
- A `protect` middleware that reads the `Authorization: Bearer <token>` header
- Checking that the note belongs to the logged in user before updating or deleting it
- Saving the token in localStorage and sending it back with every request

## How to run

```bash
cd backend && npm install && npm run dev     # http://localhost:4005
cd frontend && npm install && npm run dev    # http://localhost:5175
```

`.env` needs `MONGO_URI` and `JWT_SECRET`.

## What I learned

The token goes in a header, not in the body. I got that wrong first and kept getting
"Not authorized".

Also the ownership check is easy to forget. Without it any logged in user can delete someone
else's notes just by knowing the id.
