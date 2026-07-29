# Module 4 - React

Exercises coded along with the React crash course and the React docs from the course material.

## What is covered

- Function components, JSX, props with default values (`Counter`)
- `useState` with the functional updater form, so batched updates stay correct
- Rendering lists with stable `key` props (`TaskList` / `TaskItem`)
- Controlled form inputs and lifting state up to `App` (`TaskForm`)
- `useEffect` with cleanup: debounce timer plus `AbortController` on a real fetch (`UserSearch`)
- `useContext` and `useMemo` for a small theme provider

## How to run

```bash
npm install
npm run dev        # http://localhost:5174
```

## Takeaways

- Cleanup functions are not optional: without the `AbortController` the search results arrive out
  of order when typing fast.
- Lifting state up is what pushed the Study Tracker to Redux Toolkit: once four pages need the same
  course list, prop drilling stops scaling.
