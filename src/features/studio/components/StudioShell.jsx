import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Brush, Trash2, Undo2, Redo2, CheckCircle2 } from 'lucide-react'
import { addItem, openCart } from '@/features/cart/cartSlice'
import { useToast } from '@/hooks/useToast'
import { useStudioActions } from '../useStudio'
import {
  selectCanRedo,
  selectCanUndo,
  selectDesign,
  selectUiState,
  setBackground,
  setProductContext,
  setSnapping,
  setZoom,
} from '../studioSlice'
import { serializeDesign } from '../studioUtils'
import { useUrduFonts } from '../useUrduFonts'
import StudioCanvas from './StudioCanvas'
import StudioDock from './StudioDock'
import StudioPropertiesPanel from './StudioPropertiesPanel'
import ImageUploadButton from './ImageUploadButton'

export default function StudioShell({ product, initialColorId, initialViewId, backLink = '/', onBack }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const design = useSelector(selectDesign)
  const ui = useSelector(selectUiState)
  const canUndo = useSelector(selectCanUndo)
  const canRedo = useSelector(selectCanRedo)

  const stageRef = useRef(null)
  const backgroundLayerRef = useRef(null)
  const designLayerRef = useRef(null)
  const uiLayerRef = useRef(null)
  const mobileImageInputRef = useRef(null)

  const [selectedColorId, setSelectedColorId] = useState(initialColorId || product?.colors?.[0]?.id)
  const [selectedViewId, setSelectedViewId] = useState(initialViewId || product?.colors?.[0]?.views?.[0]?.id)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M')
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false)

  const {
    addText,
    addUrduText,
    addImage,
    addRectangle,
    addCircle,
    deleteSelected,
    setTool,
    setBrush,
    undo,
    redo,
  } = useStudioActions()

  const selectedColor = useMemo(() => {
    if (!product?.colors?.length) return null
    return product.colors.find((color) => color.id === selectedColorId) || product.colors[0]
  }, [product, selectedColorId])

  const selectedView = useMemo(() => {
    if (!selectedColor?.views?.length) return null
    return selectedColor.views.find((view) => view.id === selectedViewId) || selectedColor.views[0]
  }, [selectedColor, selectedViewId])

  useEffect(() => {
    if (!product) return

    if (!selectedColorId && product.colors?.length) {
      setSelectedColorId(product.colors[0].id)
    }
    if (!selectedViewId && selectedColor?.views?.length) {
      setSelectedViewId(selectedColor.views[0].id)
    }
  }, [product, selectedColor, selectedColorId, selectedViewId])

  useEffect(() => {
    if (!selectedColor?.views?.length) return
    const matches = selectedColor.views.some((view) => view.id === selectedViewId)
    if (!matches) {
      setSelectedViewId(selectedColor.views[0].id)
    }
  }, [selectedColor, selectedViewId])

  useEffect(() => {
    if (!product?.sizes?.length) return
    setSelectedSize(product.sizes[0])
  }, [product])

  useEffect(() => {
    if (!product || !selectedColor || !selectedView) return

    dispatch(
      setProductContext({
        id: product.id,
        name: product.name,
        colorId: selectedColor.id,
        colorName: selectedColor.name,
        colorHex: selectedColor.hex,
        price: product.price,
      })
    )

    dispatch(
      setBackground({
        imageUrl: selectedView.imageUrl,
        color: selectedColor.hex,
        viewId: selectedView.id,
        viewLabel: selectedView.label,
        printArea: selectedView.printArea,
      })
    )
  }, [dispatch, product, selectedColor, selectedView])

  const handleUrduFontsLoaded = useCallback(() => {
    designLayerRef.current?.draw()
  }, [])

  useUrduFonts(handleUrduFontsLoaded)

  function handleMobileImagePick() {
    mobileImageInputRef.current?.click()
  }

  function handleMobileImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => addImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  function exportDesign() {
    if (!stageRef.current || !backgroundLayerRef.current || !uiLayerRef.current) return null

    const stage = stageRef.current
    const backgroundLayer = backgroundLayerRef.current
    const uiLayer = uiLayerRef.current

    try {
      backgroundLayer.hide()
      uiLayer.hide()
      stage.draw()
      const printUrl = stage.toDataURL({ pixelRatio: 3 })

      backgroundLayer.show()
      stage.draw()
      const mockupUrl = stage.toDataURL({ pixelRatio: 1 })

      uiLayer.show()
      stage.draw()

      return { printUrl, mockupUrl }
    } catch (error) {
      // Canvas is tainted (CORS issue from external images). Log and return nulls.
      // The design can still be added to cart without mockups.
      console.warn('Canvas export failed (likely CORS taint):', error.message)
      
      // Ensure UI layers are visible again
      try {
        backgroundLayer.show()
        uiLayer.show()
        stage.draw()
      } catch {}
      
      // Return null mockups so cart item is still added
      return { printUrl: null, mockupUrl: null }
    }
  }

  function handleConfirmDesign() {
    if (!product || !selectedColor || !selectedView) return
    const exports = exportDesign()
    if (exports === null) return
    // exports can have null URLs if canvas export fails, but we proceed anyway

    const designJson = serializeDesign(design)
    dispatch(
      addItem({
        product,
        quantity: 1,
        selectedSize,
        selectedColor: {
          id: selectedColor.id,
          name: selectedColor.name,
          hex: selectedColor.hex,
        },
        selectedView: {
          id: selectedView.id,
          label: selectedView.label,
        },
        mockupUrl: exports.mockupUrl,
        printUrl: exports.printUrl,
        designJson,
        designId: `design-${Date.now()}`,
      })
    )

    // Show success notification and open cart
    toast.success(`Design added to cart!`)
    dispatch(openCart())

    // NOTE: Removed forced navigation so the cart drawer can slide out naturally
    // Keep the studio open and let the user continue from the cart/drawer
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-frill-50">
        <div className="text-center">
          <h2 className="font-head text-2xl font-black text-purple">Pick a product to start</h2>
          <p className="text-sm text-frill-500 mt-2">Select a product from the catalog to open the studio.</p>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-frill bg-purple text-white text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Store
            </button>
          ) : (
            <a
              href={backLink}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-frill bg-purple text-white text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Store
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-frill-50">
      <header className="h-16 px-4 lg:px-6 flex items-center gap-4 border-b border-brand-border bg-white">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-frill-600"
          >
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <a href={backLink} className="flex items-center gap-2 text-sm font-bold text-frill-600">
            <ArrowLeft size={16} /> Back
          </a>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-head text-lg font-black text-purple truncate">{product.name}</h1>
          <p className="text-[0.65rem] uppercase tracking-widest text-frill-400">
            {selectedColor?.name || 'Color'} · {selectedView?.label || 'View'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-2 rounded-frill border border-brand-border text-xs font-bold uppercase tracking-widest text-frill-600 disabled:opacity-40"
          >
            <Undo2 size={14} className="inline-block mr-1" /> Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="px-3 py-2 rounded-frill border border-brand-border text-xs font-bold uppercase tracking-widest text-frill-600 disabled:opacity-40"
          >
            <Redo2 size={14} className="inline-block mr-1" /> Redo
          </button>
          <button
            type="button"
            onClick={handleConfirmDesign}
            className="px-4 py-2 rounded-frill bg-magenta text-white text-xs font-bold uppercase tracking-widest"
          >
            <CheckCircle2 size={14} className="inline-block mr-1" /> Confirm
          </button>
        </div>
      </header>

      {/* Mobile Color/View Selector Ribbon */}
      <div className="lg:hidden h-20 px-4 py-3 bg-white border-b border-brand-border overflow-x-auto flex items-center gap-3">
        {/* Colors */}
        <div className="flex items-center gap-2 shrink-0">
          {product.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => {
                setSelectedColorId(color.id)
                setSelectedViewId(color.views?.[0]?.id)
              }}
              className={`w-7 h-7 rounded-full border-2 shrink-0 ${
                selectedColor?.id === color.id ? 'border-purple' : 'border-brand-border'
              }`}
              style={{ background: color.hex }}
              aria-label={color.name}
              title={color.name}
            />
          ))}
        </div>

        {/* Views */}
        <div className="border-r border-brand-border h-8" />
        <div className="flex items-center gap-2 shrink-0">
          {selectedColor?.views?.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setSelectedViewId(view.id)}
              className={`px-2.5 py-1 rounded-frill text-[0.6rem] uppercase tracking-widest font-bold shrink-0 ${
                selectedView?.id === view.id ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-72 bg-white border-r border-brand-border flex-col overflow-y-auto">
          <div className="p-4 border-b border-brand-border">
            <p className="text-[0.65rem] uppercase tracking-widest text-frill-400">Tools</p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setTool('select')}
                className={`px-3 py-2 rounded-frill text-xs font-bold uppercase tracking-widest ${
                  ui.tool === 'select' ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600'
                }`}
              >
                Select
              </button>
              <button
                type="button"
                onClick={addText}
                className="px-3 py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600"
              >
                Add Text
              </button>
              <button
                type="button"
                onClick={addUrduText}
                className="px-3 py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600"
              >
                Add Urdu
              </button>
              <ImageUploadButton onImageReady={addImage} label="Upload" />
              <button
                type="button"
                onClick={addRectangle}
                className="px-3 py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600"
              >
                Add Rectangle
              </button>
              <button
                type="button"
                onClick={addCircle}
                className="px-3 py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600"
              >
                Add Circle
              </button>
              <button
                type="button"
                onClick={() => setTool('brush')}
                className={`px-3 py-2 rounded-frill text-xs font-bold uppercase tracking-widest ${
                  ui.tool === 'brush' ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600'
                }`}
              >
                <Brush size={14} className="inline-block mr-2" /> Brush Mode
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                className="px-3 py-2 rounded-frill bg-red-50 text-xs font-bold uppercase tracking-widest text-red-600"
              >
                <Trash2 size={14} className="inline-block mr-2" /> Delete
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-brand-border space-y-4">
            <p className="text-[0.65rem] uppercase tracking-widest text-frill-400">Brush</p>
            <label className="text-xs text-frill-600 font-semibold">
              Color
              <input
                type="color"
                value={ui.brush.color}
                onChange={(event) => setBrush({ color: event.target.value })}
                className="mt-2 w-full h-10 border border-brand-border rounded-frill"
              />
            </label>
            <label className="text-xs text-frill-600 font-semibold">
              Thickness
              <input
                type="range"
                min="1"
                max="30"
                value={ui.brush.size}
                onChange={(event) => setBrush({ size: Number(event.target.value) })}
                className="mt-2 w-full accent-purple"
              />
            </label>
          </div>

          <div className="p-4 space-y-4 pb-32">
            <p className="text-[0.65rem] uppercase tracking-widest text-frill-400">Product</p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-frill-600">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      setSelectedColorId(color.id)
                      setSelectedViewId(color.views?.[0]?.id)
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor?.id === color.id ? 'border-purple' : 'border-brand-border'
                    }`}
                    style={{ background: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-frill-600">View</p>
              <div className="grid grid-cols-3 gap-2">
                {selectedColor?.views?.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setSelectedViewId(view.id)}
                    className={`px-2 py-2 rounded-frill text-[0.65rem] uppercase tracking-widest font-bold ${
                      selectedView?.id === view.id ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-frill-600">Size</p>
              <select
                value={selectedSize}
                onChange={(event) => setSelectedSize(event.target.value)}
                className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
              >
                {product.sizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ui.snapping}
                onChange={(event) => dispatch(setSnapping(event.target.checked))}
                className="accent-purple"
              />
              <span className="text-xs font-semibold text-frill-600">Snap to guides</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(setZoom(Math.max(ui.zoom - 0.1, 0.5)))}
                className="px-2 py-1 rounded-frill border border-brand-border text-xs font-bold"
              >
                -
              </button>
              <span className="text-xs font-semibold text-frill-600">Zoom {Math.round(ui.zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => dispatch(setZoom(Math.min(ui.zoom + 0.1, 3)))}
                className="px-2 py-1 rounded-frill border border-brand-border text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-frill-50 relative pb-28 lg:pb-0">
          <input
            ref={mobileImageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleMobileImageChange}
          />
          <div className="absolute inset-0">
            <StudioCanvas
              stageRef={stageRef}
              backgroundLayerRef={backgroundLayerRef}
              designLayerRef={designLayerRef}
              uiLayerRef={uiLayerRef}
            />
          </div>
        </main>

        <StudioPropertiesPanel mobileOpen={mobilePropsOpen} onMobileClose={() => setMobilePropsOpen(false)} />
      </div>

      <StudioDock
        tool={ui.tool}
        onToolSelect={setTool}
        onAddText={addText}
        onAddUrdu={addUrduText}
        onAddImage={handleMobileImagePick}
        onAddRect={addRectangle}
        onAddCircle={addCircle}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onConfirm={handleConfirmDesign}
        onOpenProperties={() => setMobilePropsOpen(true)}
      />
    </div>
  )
}
