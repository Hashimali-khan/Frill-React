import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Undo2, Redo2, Type, Trash2, Eye, Download, X, 
  Palette, ArrowUpToLine, ArrowDownToLine, Move
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStudio } from '@/features/design-studio/useStudio'
import { useUrduFonts } from '@/features/design-studio/useUrduFonts'
import ImageUploadButton from '@/features/design-studio/ImageUploadButton'
import { cn } from '@/utils/cn'

// ─── 1. PROPERTIES SIDEBAR COMPONENT ──────────────────────────────────────
// This lives on the right side and changes based on what the user clicks
function PropertiesSidebar({ updateProperty, layerUp, layerDown }) {
  const activeObj = useSelector(s => s.studio.activeObject)

  if (!activeObj) {
    return (
      <div className="w-80 bg-white border-l border-brand-border p-6 flex flex-col items-center justify-center text-center z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.03)]">
        <div className="w-16 h-16 bg-frill-50 rounded-full flex items-center justify-center mb-4 text-purple">
          <Move size={24} />
        </div>
        <h3 className="font-head font-bold text-purple mb-1">Canvas is Ready</h3>
        <p className="text-xs text-frill-400 leading-relaxed">
          Select an image or text on the canvas to edit its properties, colors, and layering.
        </p>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-brand-border flex flex-col h-full overflow-y-auto z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.03)]">
      <div className="p-5 border-b border-brand-border bg-frill-50">
        <h3 className="font-head text-[0.8rem] font-black uppercase tracking-widest text-purple">
          Edit {activeObj.type.replace('-', ' ')}
        </h3>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* Text Controls */}
        {activeObj.type === 'i-text' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[0.65rem] font-bold text-frill-400 uppercase tracking-wider block mb-2">Typography</label>
              <select 
                value={activeObj.fontFamily || 'Montserrat'}
                onChange={(e) => updateProperty('fontFamily', e.target.value)}
                className="w-full font-head text-sm font-bold text-purple border border-brand-border rounded p-2.5 focus:outline-none focus:border-purple"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Lora">Lora (Serif)</option>
                <option value="Inter">Inter (Clean)</option>
                <option value="Noto Nastaliq Urdu">Nastaliq Urdu</option>
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold text-frill-400 uppercase tracking-wider block mb-2">Fill Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={activeObj.fill || '#000000'}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-xs font-medium text-frill-600 uppercase">{activeObj.fill}</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Controls (Opacity & Layers) */}
        <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
          <div>
            <label className="text-[0.65rem] font-bold text-frill-400 uppercase tracking-wider block mb-2">
              Opacity: {Math.round((activeObj.opacity || 1) * 100)}%
            </label>
            <input 
              type="range" min="0.1" max="1" step="0.05"
              value={activeObj.opacity || 1}
              onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
              className="w-full accent-purple"
            />
          </div>

          <div>
            <label className="text-[0.65rem] font-bold text-frill-400 uppercase tracking-wider block mb-2">Layer Arrangement</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={layerUp} 
                className="flex items-center justify-center gap-2 border border-brand-border py-2.5 rounded-frill text-xs font-bold text-purple hover:bg-purple hover:text-white transition-colors"
              >
                <ArrowUpToLine size={14} /> Forward
              </button>
              <button 
                onClick={layerDown} 
                className="flex items-center justify-center gap-2 border border-brand-border py-2.5 rounded-frill text-xs font-bold text-purple hover:bg-purple hover:text-white transition-colors"
              >
                <ArrowDownToLine size={14} /> Backward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 2. MAIN DESIGN STUDIO PAGE ───────────────────────────────────────────
export default function DesignStudioPage() {
  const { productId } = useParams()
  const canvasRef = useRef(null)
  const urduReady = useUrduFonts()
  const [preview, setPreview] = useState(null)

  // Grab all the canvas tools from our hook
  const {
    addText, addUrduText, addImageFromDataUrl,
    deleteSelected, handleUndo, handleRedo,
    canUndo, canRedo, generatePreview,
    updateSelectedProperty, bringForward, sendBackwards
  } = useStudio(canvasRef)

  function handlePreview() {
    const url = generatePreview()
    setPreview(url)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      
      {/* ── TOP TOOLBAR ── */}
      <header className="bg-frill-800 border-b border-black/20 flex items-center px-6 h-16 shrink-0 z-20 shadow-md">
        <Link to={`/products/${productId || ''}`} className="font-head text-xl font-black text-white mr-6 hover:scale-105 transition-transform">
          Fr<span className="text-magenta">i</span>ll <span className="font-medium opacity-80">Studio</span>
        </Link>
        <div className="h-8 w-px bg-white/10 mr-6" />

        {/* Tools */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => addText()} 
            className="flex items-center gap-2 px-4 py-2 rounded-frill bg-white/5 text-white hover:bg-white/10 transition-colors font-head text-xs font-bold tracking-wider uppercase"
          >
            <Type size={16} /> Add Text
          </button>
          
          {urduReady && (
            <button 
              onClick={addUrduText} 
              className="flex items-center gap-2 px-4 py-2 rounded-frill bg-white/5 text-white hover:bg-white/10 transition-colors font-head text-xs font-bold tracking-wider uppercase"
            >
              <span className="text-base leading-none">🔤</span> اردو
            </button>
          )}

          <div className="px-4 py-2 rounded-frill bg-white/5 text-white hover:bg-white/10 transition-colors font-head text-xs font-bold tracking-wider uppercase cursor-pointer">
            <ImageUploadButton onImageReady={addImageFromDataUrl} />
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-4" />

        <button 
          onClick={deleteSelected} 
          title="Delete Selected"
          className="p-2 rounded-frill text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 size={18} />
        </button>

        {/* Global Actions */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex bg-white/5 rounded-frill p-1">
            <button 
              onClick={handleUndo} 
              disabled={!canUndo} 
              className="p-2 text-white disabled:opacity-30 hover:bg-white/10 rounded transition-colors"
            >
              <Undo2 size={16} />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={!canRedo} 
              className="p-2 text-white disabled:opacity-30 hover:bg-white/10 rounded transition-colors"
            >
              <Redo2 size={16} />
            </button>
          </div>
          
          <button 
            onClick={handlePreview} 
            className="flex items-center gap-2 px-5 py-2.5 bg-magenta text-white font-head text-xs font-black tracking-widest uppercase rounded-frill hover:bg-magenta-hot transition-all shadow-lg active:scale-95"
          >
            <Eye size={16} /> Print Preview
          </button>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-8 overflow-auto relative design-grid-bg">
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-black/5">
            <canvas ref={canvasRef} />
          </div>
        </main>

        {/* Properties Sidebar */}
        <PropertiesSidebar 
          updateProperty={updateSelectedProperty}
          layerUp={bringForward}
          layerDown={sendBackwards}
        />
      </div>

      {/* ── PRINT PREVIEW MODAL ── */}
      <AnimatePresence>
        {preview && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-frill-800/95 backdrop-blur-sm flex items-center justify-center z-50 p-8"
          >
            <div className="bg-white rounded-frill-lg overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col max-h-full">
              <div className="flex items-center justify-between p-5 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <Palette className="text-magenta" size={20} />
                  <h2 className="font-head text-lg font-black text-purple uppercase tracking-widest">High-Res Preview</h2>
                </div>
                <button 
                  onClick={() => setPreview(null)} 
                  className="p-1 rounded-full text-frill-400 hover:text-magenta hover:bg-magenta/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 bg-frill-50 flex-1 overflow-auto flex justify-center">
                <img 
                  src={preview} 
                  alt="Print preview" 
                  className="max-w-full h-auto shadow-md border border-brand-border bg-white" 
                />
              </div>
              
              <div className="p-5 border-t border-brand-border bg-white flex gap-3">
                <button 
                  onClick={() => setPreview(null)}
                  className="flex-1 py-3 font-head text-xs font-bold uppercase tracking-widest text-frill-600 hover:text-purple transition-colors"
                >
                  Keep Editing
                </button>
                <a 
                  href={preview} 
                  download={`frill-design-${productId || 'custom'}.png`}
                  className="flex-2 bg-purple text-white font-head text-sm font-black tracking-widest uppercase py-3 px-6 rounded-frill flex items-center justify-center gap-2 hover:bg-purple-mid transition-all shadow-md active:scale-95"
                >
                  <Download size={18} /> Download Print File
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Pattern Background */}
      <style dangerouslySetInnerHTML={{__html: `
        .design-grid-bg {
          background-color: #f8f7fb;
          background-image: radial-gradient(#ddd5f0 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />
    </div>
  )
}