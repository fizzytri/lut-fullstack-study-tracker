import { useState } from 'react'

const Counter = ({ step = 1 }) => {
  const [count, setCount] = useState(0)

  return (
    <div className="row">
      <button type="button" onClick={() => setCount((prev) => prev - step)}>
        -
      </button>
      <strong>{count}</strong>
      <button type="button" onClick={() => setCount((prev) => prev + step)}>
        +
      </button>
      <button type="button" className="ghost" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  )
}

export default Counter
