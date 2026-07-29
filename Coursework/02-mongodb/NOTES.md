# Module 2 - MongoDB

Exercises coded along with the MongoDB crash course from the course material.

## What is covered

- Connecting with Mongoose, environment based connection string
- Schemas, validation rules, `timestamps`, virtuals
- Full CRUD: `create`, `find`, `findOne`, `updateOne`, `deleteOne`, `countDocuments`
- Query operators: `$gte`, `$gt`, `$lt`, `$in`, `$set`, `$inc`
- References between collections plus `populate` and `$lookup`
- Aggregation pipelines: `$group`, `$unwind`, `$project`, `$sort`, `$round`
- Raw shell queries in `queries.mongodb`

## How to run

Requires a local `mongod` or a MongoDB Atlas connection string in `.env`:

```bash
npm install
MONGO_URI=mongodb://127.0.0.1:27017/coursework node crud.js
MONGO_URI=mongodb://127.0.0.1:27017/coursework node aggregate.js
```

Windows service troubleshooting is linked in the Moodle material; `mongod --dbpath` also works.

## Takeaways

- `populate` is a second query from the driver, `$lookup` runs server-side; the aggregation version
  is what the Study Tracker dashboard uses, because grouping happens in the same round trip.
- Schema validation catches bad data before it reaches the database, but it is Mongoose-level only.
