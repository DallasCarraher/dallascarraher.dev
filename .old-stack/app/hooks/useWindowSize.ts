import * as React from 'react'

/**
 * Hook for creating conditions based on current Window Dimensions
 * @returns the width of the current Window
 */
export default function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = React.useState({
    width: -1,
    height: -1,
  })

  // Remix makes it easy! This code only runs on the client
  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
