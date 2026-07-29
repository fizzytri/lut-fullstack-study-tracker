# Module 2 - MongoDB

Notes from coding along with the MongoDB crash course.

## What I practised

- Connecting to MongoDB with Mongoose
- Writing schemas with required fields, defaults and `timestamps`
- CRUD: `create`, `find`, `findOne`, `updateOne`, `deleteOne`
- Query operators: `$gte`, `$gt`, `$lt`, `$in`, `$set`, `$inc`
- Linking two collections with a ref and loading them together with `populate`
- Grouping with `$group` in an aggregation pipeline
- Running queries straight in the shell (`queries.mongodb`)

## How to run

Needs MongoDB running locally, or an Atlas connection string in `.env`.

```bash
npm install
node crud.js
node aggregate.js
```

Getting `mongod` running as a Windows service was the annoying part. The Stack Overflow link in
the Moodle material helped: https://stackoverflow.com/questions/2438055/how-to-run-mongodb-as-windows-service

## What I learned

`populate` is nice but it is really Mongoose doing a second query for you. Aggregation does the
grouping on the database side instead, which is faster but harder to read.

For my own project I ended up doing most of the counting in plain JavaScript, because I could
actually follow what was happening.
