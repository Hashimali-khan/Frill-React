import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useCloudinary } from '@/hooks/useCloudinary'
import { useToast } from '@/hooks/useToast'

/**
 * Upload button for design studio images
 * Tries Cloudinary first, falls back to local data URL if not configured
 * Supports PNG, JPG, SVG, WEBP
 */
export default function ImageUploadButton({ onImageReady }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const { uploadImage } = useCloudinary()
  const { toast } = useToast()

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const maxSizeMB = 10
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMB}MB.`)
      return
    }

    setUploading(true)
    try {
      // Try uploading to Cloudinary
      const cloudUrl = await uploadImage(file)
      
      if (cloudUrl) {
        // Success - use Cloudinary URL
        onImageReady(cloudUrl)
        toast.success('Image uploaded to CDN')
        return
      }

      // Fallback: Convert to data URL if Cloudinary not available
      const reader = new FileReader()
      reader.onload = (ev) => {
        onImageReady(ev.target.result)
      }
      reader.onerror = () => {
        toast.error('Failed to read file')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="studio-tool-btn disabled:opacity-50 disabled:cursor-not-allowed"
        title={uploading ? 'Uploading...' : 'Upload image to design'}
      >
        <Upload size={16} /> {uploading ? 'Uploading...' : 'Image'}
      </button>
    </>
  )
}