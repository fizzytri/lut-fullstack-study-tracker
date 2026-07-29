# Module 4 - React

Notes from coding along with the React crash course and the React docs.

## What I practised

- Function components and JSX
- `useState` for the counter and the task list
- Rendering a list with `.map()` and giving each item a `key`
- Passing props down and passing functions back up (`onAdd`, `onToggle`, `onDelete`)
- Controlled inputs, where the value comes from state
- `useEffect` with a dependency array to fetch data when the query changes

## How to run

```bash
npm install
npm run dev      # http://localhost:5174
```

## What I learned

Keeping the tasks in `App` and passing handlers down took a while to click. Once four different
components need the same data it starts to feel messy, which is apparently why Redux exists -
that comes up in the next module.

The GitHub search fires a request on every keystroke. That is fine for an exercise but I would
want to slow it down in a real app.
