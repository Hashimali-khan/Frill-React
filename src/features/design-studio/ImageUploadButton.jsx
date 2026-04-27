import { useRef } from 'react'
import { Upload } from 'lucide-react'

/**
 * Hidden file input triggered by a styled button.
 * Converts user's file to a data URL and calls onImageReady().
 * Accepts PNG, JPG, SVG, WEBP.
 */
export default function ImageUploadButton({ onImageReady }) {
  const fileRef = useRef()

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const maxSizeMB = 10
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Max ${maxSizeMB}MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => onImageReady(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <input
        ref={fileRef} type="file" className="hidden"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileRef.current.click()}
        className="studio-tool-btn"
      >
        <Upload size={16} /> Image
      </button>
    </>
  )
}