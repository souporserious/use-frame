import { useEffect, useLayoutEffect, useRef } from "react"
import sync, { cancelSync } from "framesync"

export { flushSync, getFrameData } from "framesync"
export { cancelSync, sync }

const isServer = typeof window === "undefined"
const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect

export function useFrame(
  callback: (event: {
    /** Cancel the current scheduled frame. */
    cancel: () => void

    /** The time elapsed since mounting or re-enabling. */
    elapsed: number

    /** Data about the current frame. */
    frame: {
      delta: number
      timestamp: number
    }
  }) => void,
  {
    enabled = true,
    once = true,
    type = "update",
  }: {
    /** Whether or not the frame callback should run. */
    enabled: boolean

    /** Only runs the scheduled frame one time. */
    once: boolean

    /** The priority of execution across a frame. */
    type:
      | "postRender"
      | "postUpdate"
      | "preRender"
      | "read"
      | "render"
      | "update"
  },
) {
  const callbackRef = useRef<any>()

  callbackRef.current = callback

  useIsomorphicLayoutEffect(() => {
    const cancel = () => {
      process && cancelSync[type](process)
      initialTimestamp = null
    }
    let initialTimestamp: number | null = null
    let process: any

    cancel()

    if (enabled) {
      process = sync[type](({ delta, timestamp }) => {
        if (!initialTimestamp) {
          initialTimestamp = timestamp
        }

        callbackRef.current({
          cancel,
          elapsed: timestamp - initialTimestamp,
          frame: { delta, timestamp },
        })
      }, !once)
    }

    return () => {
      if (process) {
        cancelSync[type](process)
      }
    }
  }, [enabled])
}
