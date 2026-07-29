# Module 1 - Node.js

Exercises coded along with the Node.js crash course from the course material.

## What is covered

- CommonJS modules: `module.exports` / `require` (`people.js`, `logger.js`, `fileTasks.js`)
- Core modules: `os`, `path`, `fs`, `fs/promises`, `events`, `crypto`, `http`
- Classes and a custom `EventEmitter` subclass (`Logger`)
- Callback, promise and stream based file access
- A bare HTTP server without Express, so the difference to module 3 is visible

## How to run

```bash
node index.js     # module + fs + events demo, writes data/report.txt
node server.js    # core http server on http://localhost:4001
```

## Takeaways

- `fs/promises` removes callback nesting; streams matter once files stop being small.
- `EventEmitter` is the pattern behind most of Node core, including `http` and streams.
- Writing routing by hand in `server.js` explains why Express exists.
