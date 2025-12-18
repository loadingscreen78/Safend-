
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Anything below 768px is considered mobile or tablet

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Use matchMedia to check if the screen size is below the mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Set initial state
    setIsMobile(mql.matches)
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Clean up
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return current mobile state with fallback to false if it's undefined
  return isMobile === undefined ? false : isMobile
}
