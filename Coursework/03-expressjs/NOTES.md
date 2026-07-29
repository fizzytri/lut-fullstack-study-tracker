# Module 3 - Express.js

Exercises coded along with the Express crash course from the course material.
Reference source used in the tutorial: https://github.com/bradtraversy/express-crash/

## What is covered

- `express.Router` and mounting routers under `/api/members`
- Route params (`:id`) and query strings (`?status=&limit=`)
- Full REST verbs: GET, POST, PUT, DELETE with correct status codes
- Custom middleware: a request logger and a body validator
- Built-in middleware: `express.json`, `express.urlencoded`, `express.static`
- 404 handler and a central error handler placed last
- A small static frontend that talks to the API with `fetch`

## How to run

```bash
npm install
npm start          # http://localhost:4003
```

`requests.http` works with the VS Code REST Client extension.

## Takeaways

- Middleware order is the whole model: anything registered after a response is sent never runs,
  and the 404 handler has to sit below every real route.
- The same layering (routes -> controllers -> middleware) is what the Study Tracker backend uses,
  only with Mongoose in place of the in-memory array.
