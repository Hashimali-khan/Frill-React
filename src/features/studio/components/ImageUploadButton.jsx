import { useRef } from 'react'
import { Upload } from 'lucide-react'

export default function ImageUploadButton({ onImageReady, label = 'Image', className }) {
  const inputRef = useRef(null)

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const maxSizeMB = 12
    if (file.size > maxSizeMB * 1024 * 1024) {
      window.alert(`File too large. Max ${maxSizeMB}MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      onImageReady?.(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={
          className ||
          'flex items-center gap-2 px-3 py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600'
        }
      >
        <Upload size={16} /> {label}
      </button>
    </>
  )
}
