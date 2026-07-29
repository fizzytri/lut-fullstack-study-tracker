# Module 3 - Express.js

Notes from coding along with the Express crash course.
The tutorial's source code is here: https://github.com/bradtraversy/express-crash/

## What I practised

- `express.Router` and mounting it with `app.use('/api/members', ...)`
- Route params (`/:id`) and query strings (`?status=active&limit=1`)
- GET, POST, PUT and DELETE with the right status codes
- Writing my own middleware: a logger and a validator
- Built-in middleware: `express.json`, `express.urlencoded`, `express.static`
- A 404 handler and an error handler at the bottom of the file
- A small static page that calls the API with `fetch`

## How to run

```bash
npm install
npm start        # http://localhost:4003
```

`requests.http` works with the REST Client extension in VS Code.

## What I learned

Middleware order matters more than I expected. I put the 404 handler above my routes at first and
every request returned 404. Moving it below the routes fixed it.

This is basically the same structure I used in my own project, just with MongoDB instead of an
array in memory.
