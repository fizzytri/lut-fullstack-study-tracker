# Module 1 - Node.js

Notes from coding along with the Node.js crash course.

## What I practised

- Splitting code into modules with `module.exports` and `require`
- Core modules: `os`, `path`, `fs`, `events`, `http`
- Making a class and a class that extends `EventEmitter`
- Reading and writing files, first with callbacks and then with promises
- Building a small HTTP server with no framework

## How to run

```bash
node index.js     # writes data/report.txt and logs to the console
node server.js    # http server on http://localhost:4001
```

## What I learned

Doing the routing by hand in `server.js` was annoying - you have to check `req.url` and
`req.method` yourself for every route. That made it obvious why Express exists.

`EventEmitter` also showed up again later in streams, so it seems to be everywhere in Node.
