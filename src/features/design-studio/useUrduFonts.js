import { useEffect, useState } from 'react'

const URDU_FONTS = [
  { name: 'Noto Nastaliq Urdu', url: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap' },
  { name: 'Noto Naskh Arabic',  url: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap' },
]

/**
 * Injects Google Fonts <link> tags and uses the FontFace API
 * to ensure the font is fully loaded before Fabric.js renders.
 */
export function useUrduFonts() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    URDU_FONTS.forEach(font => {
      if (!document.querySelector(`link[href="${font.url}"]`)) {
        const link = document.createElement('link')
        link.rel  = 'stylesheet'
        link.href = font.url
        document.head.appendChild(link)
      }
    })
    // FontFace API: wait until 'Noto Nastaliq Urdu' is truly ready
    document.fonts.load('400 24px "Noto Nastaliq Urdu"').then(() => {
      setLoaded(true)
    })
  }, [])

  return loaded
}