const TOAST_CONTAINER_ID = 'frill-toast-container'
const TOAST_REMOVE_MS = 2800

function ensureContainer() {
  if (typeof document === 'undefined') return null

  let container = document.getElementById(TOAST_CONTAINER_ID)
  if (container) return container

  container = document.createElement('div')
  container.id = TOAST_CONTAINER_ID
  container.style.position = 'fixed'
  container.style.right = '1rem'
  container.style.bottom = '1rem'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.gap = '0.5rem'
  container.style.zIndex = '999999'
  container.style.maxWidth = 'min(92vw, 22rem)'
  container.style.pointerEvents = 'none'

  document.body.appendChild(container)
  return container
}

function getToneStyles(tone) {
  if (tone === 'success') {
    return {
      background: '#16a34a',
      color: '#ffffff',
    }
  }

  if (tone === 'error') {
    return {
      background: '#dc2626',
      color: '#ffffff',
    }
  }

  return {
    background: '#4f46e5',
    color: '#ffffff',
  }
}

function showToast(message, tone = 'default') {
  if (!message) return

  if (typeof document === 'undefined') {
    // Fallback for non-browser environments
    // eslint-disable-next-line no-console
    console.log(`[toast:${tone}] ${message}`)
    return
  }

  const container = ensureContainer()
  if (!container) return

  const toast = document.createElement('div')
  const toneStyles = getToneStyles(tone)

  toast.textContent = String(message)
  toast.style.background = toneStyles.background
  toast.style.color = toneStyles.color
  toast.style.fontFamily = 'Montserrat, sans-serif'
  toast.style.fontWeight = '700'
  toast.style.fontSize = '0.8rem'
  toast.style.lineHeight = '1.25'
  toast.style.padding = '0.7rem 0.85rem'
  toast.style.borderRadius = '0.65rem'
  toast.style.boxShadow = '0 8px 22px rgba(15, 23, 42, 0.25)'
  toast.style.border = '1px solid rgba(255, 255, 255, 0.28)'
  toast.style.pointerEvents = 'auto'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(6px)'
  toast.style.transition = 'opacity 180ms ease, transform 180ms ease'

  container.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  })

  window.setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(6px)'

    window.setTimeout(() => {
      toast.remove()
      if (!container.childElementCount) {
        container.remove()
      }
    }, 180)
  }, TOAST_REMOVE_MS)
}

export function useToast() {
  const toast = (message) => showToast(message)

  toast.success = (message) => showToast(message, 'success')
  toast.error = (message) => showToast(message, 'error')

  return { toast }
}
