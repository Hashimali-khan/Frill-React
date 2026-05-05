import { useToast } from './useToast'

/**
 * Hook for uploading images to Cloudinary with fallback to local data URL
 * Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env vars
 */
export function useCloudinary() {
  const { toast } = useToast()

  async function uploadImage(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    // If not configured, return null (will use fallback data URL)
    if (!cloudName || !preset) {
      console.warn('Cloudinary not configured. Using local data URL instead.')
      return null
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', preset)
      formData.append('cloud_name', cloudName)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(30000), // 30s timeout
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }

      const data = await response.json()
      return data.secure_url // Returns HTTPS URL from Cloudinary CDN
    } catch (err) {
      console.error('Cloudinary upload error:', err)
      // Don't show error toast - just fall back to data URL silently
      return null
    }
  }

  return { uploadImage }
}
