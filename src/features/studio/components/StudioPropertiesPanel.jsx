import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  finalizeObject,
  removeObject,
  reorderObject,
  selectActiveObject,
  selectUiState,
  setKeyboardLayout,
  updateObject,
} from '../studioSlice'
import UrduKeyboard from './UrduKeyboard'

function LabeledRange({ label, value, min, max, step, onChange, onCommit }) {
  return (
    <label className="text-xs text-frill-600 font-semibold">
      <span className="block mb-1">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        className="w-full accent-purple"
      />
    </label>
  )
}

export default function StudioPropertiesPanel() {
  const dispatch = useDispatch()
  const activeObject = useSelector(selectActiveObject)
  const ui = useSelector(selectUiState)

  const handleUpdate = useCallback(
    (changes, commit = false) => {
      if (!activeObject) return
      if (commit) {
        dispatch(finalizeObject({ id: activeObject.id, changes }))
      } else {
        dispatch(updateObject({ id: activeObject.id, changes }))
      }
    },
    [activeObject, dispatch]
  )

  const handleCommit = useCallback(() => {
    if (!activeObject) return
    dispatch(finalizeObject({ id: activeObject.id, changes: {} }))
  }, [activeObject, dispatch])

  const textValue = useMemo(() => {
    if (!activeObject || activeObject.type !== 'text') return ''
    return activeObject.text
  }, [activeObject])

  if (!activeObject) {
    return (
      <div className="hidden lg:flex w-80 bg-white border-l border-brand-border p-6 text-center text-frill-500">
        <div>
          <p className="font-head text-sm font-bold text-purple">Select a layer</p>
          <p className="text-xs mt-2">Tap any element on the canvas to edit its properties.</p>
        </div>
      </div>
    )
  }

  return (
    <aside className="hidden lg:flex w-80 bg-white border-l border-brand-border flex-col overflow-y-auto">
      <div className="p-5 border-b border-brand-border">
        <p className="text-[0.65rem] uppercase tracking-widest text-frill-400">Properties</p>
        <h3 className="font-head text-lg font-black text-purple">{activeObject.name}</h3>
      </div>

      <div className="p-5 space-y-6">
        {activeObject.type === 'text' && (
          <div className="space-y-4">
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Text</span>
              <textarea
                value={textValue}
                onChange={(event) => handleUpdate({ text: event.target.value })}
                onBlur={handleCommit}
                className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm min-h-20"
              />
            </label>

            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Font</span>
              <select
                value={activeObject.fontFamily}
                onChange={(event) => handleUpdate({ fontFamily: event.target.value }, true)}
                className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Lora">Lora</option>
                <option value="Inter">Inter</option>
                <option value="Noto Nastaliq Urdu">Noto Nastaliq Urdu</option>
                <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-frill-600 font-semibold">
                <span className="block mb-1">Size</span>
                <input
                  type="number"
                  value={activeObject.fontSize}
                  min="12"
                  max="120"
                  onChange={(event) => handleUpdate({ fontSize: Number(event.target.value) })}
                  onBlur={handleCommit}
                  className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-frill-600 font-semibold">
                <span className="block mb-1">Color</span>
                <input
                  type="color"
                  value={activeObject.fill}
                  onChange={(event) => handleUpdate({ fill: event.target.value }, true)}
                  className="w-full h-10 border border-brand-border rounded-frill"
                />
              </label>
            </div>

            <UrduKeyboard
              layout={ui.keyboardLayout}
              onInput={(value) => handleUpdate({ text: `${textValue}${value}` })}
              onBackspace={() => handleUpdate({ text: textValue.slice(0, -1) })}
              onSpace={() => handleUpdate({ text: `${textValue} ` })}
              onLayoutChange={(layout) => dispatch(setKeyboardLayout(layout))}
            />
            <button
              type="button"
              onClick={handleCommit}
              className="w-full py-2 rounded-frill bg-frill-100 text-xs font-bold uppercase tracking-widest text-frill-600"
            >
              Commit Text
            </button>
          </div>
        )}

        {activeObject.type === 'image' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-frill-600 font-semibold">
                <span className="block mb-1">Grayscale</span>
                <button
                  type="button"
                  onClick={() => handleUpdate({ filters: { ...activeObject.filters, grayscale: !activeObject.filters?.grayscale } }, true)}
                  className={`w-full py-2 rounded-frill text-xs font-bold uppercase tracking-widest ${
                    activeObject.filters?.grayscale ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600'
                  }`}
                >
                  {activeObject.filters?.grayscale ? 'On' : 'Off'}
                </button>
              </label>
              <label className="text-xs text-frill-600 font-semibold">
                <span className="block mb-1">Brightness</span>
                <input
                  type="range"
                  min="-0.8"
                  max="0.8"
                  step="0.05"
                  value={activeObject.filters?.brightness || 0}
                  onChange={(event) =>
                    handleUpdate({
                      filters: { ...activeObject.filters, brightness: Number(event.target.value) },
                    })
                  }
                  onMouseUp={handleCommit}
                  onTouchEnd={handleCommit}
                  className="w-full accent-purple"
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-frill-500">Crop</p>
              <LabeledRange
                label={`Zoom: ${activeObject.crop?.zoom?.toFixed(2) || '1.00'}`}
                value={activeObject.crop?.zoom || 1}
                min={1}
                max={3}
                step={0.05}
                onChange={(value) => handleUpdate({ crop: { ...activeObject.crop, zoom: value } })}
                onCommit={handleCommit}
              />
              <LabeledRange
                label={`Offset X: ${(activeObject.crop?.offsetX ?? 0.5).toFixed(2)}`}
                value={activeObject.crop?.offsetX ?? 0.5}
                min={0}
                max={1}
                step={0.02}
                onChange={(value) => handleUpdate({ crop: { ...activeObject.crop, offsetX: value } })}
                onCommit={handleCommit}
              />
              <LabeledRange
                label={`Offset Y: ${(activeObject.crop?.offsetY ?? 0.5).toFixed(2)}`}
                value={activeObject.crop?.offsetY ?? 0.5}
                min={0}
                max={1}
                step={0.02}
                onChange={(value) => handleUpdate({ crop: { ...activeObject.crop, offsetY: value } })}
                onCommit={handleCommit}
              />
            </div>
          </div>
        )}

        {activeObject.type === 'shape' && (
          <div className="space-y-4">
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Fill</span>
              <input
                type="color"
                value={activeObject.fill}
                onChange={(event) => handleUpdate({ fill: event.target.value }, true)}
                className="w-full h-10 border border-brand-border rounded-frill"
              />
            </label>
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Stroke</span>
              <input
                type="color"
                value={activeObject.stroke || '#000000'}
                onChange={(event) => handleUpdate({ stroke: event.target.value }, true)}
                className="w-full h-10 border border-brand-border rounded-frill"
              />
            </label>
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Stroke Width</span>
              <input
                type="number"
                value={activeObject.strokeWidth || 0}
                min="0"
                max="20"
                onChange={(event) => handleUpdate({ strokeWidth: Number(event.target.value) })}
                onBlur={handleCommit}
                className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
              />
            </label>
          </div>
        )}

        {activeObject.type === 'line' && (
          <div className="space-y-4">
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Stroke</span>
              <input
                type="color"
                value={activeObject.stroke}
                onChange={(event) => handleUpdate({ stroke: event.target.value }, true)}
                className="w-full h-10 border border-brand-border rounded-frill"
              />
            </label>
            <label className="text-xs text-frill-600 font-semibold">
              <span className="block mb-1">Thickness</span>
              <input
                type="range"
                min="1"
                max="30"
                value={activeObject.strokeWidth}
                onChange={(event) => handleUpdate({ strokeWidth: Number(event.target.value) })}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
                className="w-full accent-purple"
              />
            </label>
          </div>
        )}

        <div className="space-y-3 border-t border-brand-border pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-frill-500">Transform</p>
          <LabeledRange
            label={`Opacity: ${Math.round((activeObject.opacity ?? 1) * 100)}%`}
            value={activeObject.opacity ?? 1}
            min={0.1}
            max={1}
            step={0.05}
            onChange={(value) => handleUpdate({ opacity: value })}
            onCommit={handleCommit}
          />
          <LabeledRange
            label={`Rotation: ${Math.round(activeObject.rotation || 0)}deg`}
            value={activeObject.rotation || 0}
            min={-180}
            max={180}
            step={1}
            onChange={(value) => handleUpdate({ rotation: value })}
            onCommit={handleCommit}
          />
          <LabeledRange
            label={`Skew X: ${(activeObject.skewX || 0).toFixed(2)}`}
            value={activeObject.skewX || 0}
            min={-1}
            max={1}
            step={0.05}
            onChange={(value) => handleUpdate({ skewX: value })}
            onCommit={handleCommit}
          />
          <LabeledRange
            label={`Skew Y: ${(activeObject.skewY || 0).toFixed(2)}`}
            value={activeObject.skewY || 0}
            min={-1}
            max={1}
            step={0.05}
            onChange={(value) => handleUpdate({ skewY: value })}
            onCommit={handleCommit}
          />
        </div>

        <div className="space-y-3 border-t border-brand-border pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-frill-500">Layer Order</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => dispatch(reorderObject({ id: activeObject.id, direction: 'forward' }))}
              className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-brand-border rounded-frill"
            >
              Forward
            </button>
            <button
              type="button"
              onClick={() => dispatch(reorderObject({ id: activeObject.id, direction: 'backward' }))}
              className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-brand-border rounded-frill"
            >
              Backward
            </button>
            <button
              type="button"
              onClick={() => dispatch(reorderObject({ id: activeObject.id, direction: 'front' }))}
              className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-brand-border rounded-frill"
            >
              To Front
            </button>
            <button
              type="button"
              onClick={() => dispatch(reorderObject({ id: activeObject.id, direction: 'back' }))}
              className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-brand-border rounded-frill"
            >
              To Back
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(removeObject(activeObject.id))}
          className="w-full py-2 rounded-frill bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest"
        >
          Delete Layer
        </button>
      </div>
    </aside>
  )
}
