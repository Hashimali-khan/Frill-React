// src/pages/studio/PropertiesSidebar.jsx
import { useSelector } from 'react-redux'
import { Layers, Type, Palette } from 'lucide-react'

export default function PropertiesSidebar({ updateProperty, layerUp, layerDown }) {
  const activeObj = useSelector(s => s.studio.activeObject)

  if (!activeObj) {
    return (
      <div className="w-64 bg-white border-l border-brand-border p-4 flex items-center justify-center text-frill-400 font-head text-sm">
        Select an object to edit
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-brand-border p-4 flex flex-col gap-6">
      <h3 className="font-head text-sm font-bold uppercase tracking-widest text-purple border-b pb-2">
        Edit {activeObj.type}
      </h3>

      {/* Text specific controls */}
      {activeObj.type === 'i-text' && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-frill-600 uppercase">Font</label>
          <select 
            value={activeObj.fontFamily}
            onChange={(e) => updateProperty('fontFamily', e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Montserrat">Montserrat</option>
            <option value="Noto Nastaliq Urdu">Nastaliq Urdu</option>
          </select>

          <label className="text-xs font-bold text-frill-600 uppercase mt-2">Color</label>
          <input 
            type="color" 
            value={activeObj.fill}
            onChange={(e) => updateProperty('fill', e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>
      )}

      {/* Universal Controls (Opacity & Layers) */}
      <div className="flex flex-col gap-3 border-t pt-4">
        <label className="text-xs font-bold text-frill-600 uppercase">Opacity</label>
        <input 
          type="range" min="0.1" max="1" step="0.1"
          value={activeObj.opacity}
          onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
          className="w-full"
        />

        <div className="flex gap-2 mt-2">
          <button onClick={layerUp} className="flex-1 border py-2 text-xs font-bold hover:bg-gray-50">
            Bring Fwd
          </button>
          <button onClick={layerDown} className="flex-1 border py-2 text-xs font-bold hover:bg-gray-50">
            Send Back
          </button>
        </div>
      </div>
    </div>
  )
}