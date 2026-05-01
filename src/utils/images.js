const UNSPLASH_HOST = 'images.unsplash.com'
const CROPPED_PARAMS = {
  w: '600',
  auto: 'format',
  fit: 'crop',
  q: '80',
}

function isUnsplashUrl(url) {
  try {
    return new URL(url).host === UNSPLASH_HOST
  } catch {
    return false
  }
}

export function applyProductImageCrop(url) {
  if (!url || typeof url !== 'string') return url
  if (!isUnsplashUrl(url)) return url.trim()

  try {
    const parsed = new URL(url)
    parsed.searchParams.set('w', CROPPED_PARAMS.w)
    parsed.searchParams.set('auto', CROPPED_PARAMS.auto)
    parsed.searchParams.set('fit', CROPPED_PARAMS.fit)
    parsed.searchParams.set('q', CROPPED_PARAMS.q)
    parsed.searchParams.delete('h')
    return parsed.toString()
  } catch {
    return url.trim()
  }
}

export function applyProductImageCropList(images) {
  return (Array.isArray(images) ? images : [])
    .map(applyProductImageCrop)
    .filter(Boolean)
}
