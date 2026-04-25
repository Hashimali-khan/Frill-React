import { useState, useEffect } from 'react'

/**
 * useScrolled — Returns true when window.scrollY > threshold
 * Extracted from SiteHeader to keep the component declarative.
 *
 * @param {number} threshold - Default 10px
 */
export function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    // Passive listener = browser can optimise scroll performance
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}