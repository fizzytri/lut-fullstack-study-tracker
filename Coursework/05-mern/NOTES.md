# Module 5 - MERN stack

Followed the MERN example project playlist from the course material
(source reference: https://github.com/bradtraversy/mern-tutorial).

This folder keeps the exercise version of the stack: a single `Note` resource with JWT auth,
wired end to end. It is deliberately small, because the full application built from these lessons
is the Study Tracker in `/project`.

## What is covered

- Splitting the repo into `backend` and `frontend` with a proxy in development
- `express-async-handler` plus a central error handler instead of try/catch in every controller
- User registration and login, password hashing with bcrypt, JWT issuing and verification
- A `protect` middleware that reads `Authorization: Bearer <token>` and attaches `req.user`
- Ownership checks so one user cannot read or delete another user's documents
- A React client that stores the token and sends it on every request

## How to run

```bash
cd backend && npm install && npm run dev     # http://localhost:4005
cd frontend && npm install && npm run dev    # http://localhost:5175
```

`.env` needs `MONGO_URI` and `JWT_SECRET`.

## Takeaways

- The token belongs in an `Authorization` header, not in the body; an axios interceptor sets it
  once instead of in every service function.
- Returning `401` for auth failures and `403` for ownership failures makes the client logic simple:
  only `401` should log the user out.
