import { useLayoutEffect, useRef } from 'react'
import sync, { cancelSync } from 'framesync'

export function useFrame(
  callback: (
    frame: Parameters<typeof sync.render>[0],
    cancel: () => void
  ) => void,
  enabled: boolean = true
) {
  const processRef = useRef<ReturnType<typeof sync.render>>()
  const callbackRef = useRef<any>()

  callbackRef.current = callback

  useLayoutEffect(() => {
    const cancel = () => process && cancelSync.render(process)
    let process = processRef.current

    cancel()

    if (enabled) {
      process = sync.render((frame) => {
        callbackRef.current(frame, cancel)
      }, true)
    }

    processRef.current = process

    return () => {
      if (process) {
        cancelSync.render(process)
      }
    }
  }, [enabled])
}
