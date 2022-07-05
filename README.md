# use-frame

Sync animation frames in React. Powered by [framesync](https://www.npmjs.com/package/framesync).

## Install

```bash
npm install use-frame
```

## Usage

```tsx
import { useState } from "react"
import { useFrame } from "use-frame"

export default function App() {
  const [currentTime, setCurrentTime] = useState(0)

  useFrame(({ timestamp }) => {
    setCurrentTime(timestamp)
  })

  return <div>Time Elapsed: {currentTime}</div>
}
```
