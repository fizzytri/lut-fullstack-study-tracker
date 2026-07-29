# Coursework

Exercise projects coded along with the tutorial series listed in the Moodle course
*Software Development Skills: Full-Stack*. One folder per module, each with its own
`NOTES.md` describing what was practised and how to run it.

| Module | Folder | Focus |
| --- | --- | --- |
| 1 | `01-nodejs` | Modules, core APIs, events, streams, bare HTTP server |
| 2 | `02-mongodb` | Mongoose schemas, CRUD, query operators, aggregation |
| 3 | `03-expressjs` | Routers, middleware, REST verbs, static files, error handling |
| 4 | `04-react` | Components, props, state, hooks, forms, effects, context |
| 5 | `05-mern` | The four combined: JWT auth and a protected CRUD resource |

Each folder installs independently:

```bash
cd Coursework/01-nodejs && npm install && npm start
```

Modules 2 and 5 need a running MongoDB instance (local `mongod` or a MongoDB Atlas URI).

The full application built on top of these exercises lives in [`../project`](../project).
