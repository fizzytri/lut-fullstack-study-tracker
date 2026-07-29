import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="row">
      <button type="button" onClick={() => setCount(count - 1)}>
        -
      </button>
      <strong>{count}</strong>
      <button type="button" onClick={() => setCount(count + 1)}>
        +
      </button>
      <button type="button" className="ghost" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  )
}

export default Counter
