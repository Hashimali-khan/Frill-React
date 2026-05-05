import { Type, Brush, ImageIcon, Square, Circle, MousePointer2, Undo2, Redo2, CheckCircle2, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function StudioDock({
  tool,
  onToolSelect,
  onAddText,
  onAddUrdu,
  onAddImage,
  onAddRect,
  onAddCircle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onConfirm,
  onOpenProperties,
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border z-40">
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <button
          type="button"
          onClick={() => onToolSelect('select')}
          className={cn('p-2 rounded-frill', tool === 'select' ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600')}
        >
          <MousePointer2 size={18} />
        </button>
        <button
          type="button"
          onClick={onAddText}
          className="p-2 rounded-frill bg-frill-100 text-frill-600"
        >
          <Type size={18} />
        </button>
        <button
          type="button"
          onClick={onAddUrdu}
          className="px-2.5 py-2 rounded-frill bg-frill-100 text-frill-600 text-xs font-bold"
        >
          Urdu
        </button>
        <button
          type="button"
          onClick={onAddImage}
          className="p-2 rounded-frill bg-frill-100 text-frill-600"
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={onAddRect}
          className="p-2 rounded-frill bg-frill-100 text-frill-600"
        >
          <Square size={18} />
        </button>
        <button
          type="button"
          onClick={onAddCircle}
          className="p-2 rounded-frill bg-frill-100 text-frill-600"
        >
          <Circle size={18} />
        </button>
        <button
          type="button"
          onClick={() => onToolSelect('brush')}
          className={cn('p-2 rounded-frill', tool === 'brush' ? 'bg-purple text-white' : 'bg-frill-100 text-frill-600')}
        >
          <Brush size={18} />
        </button>
        <button
          type="button"
          onClick={() => onOpenProperties?.()}
          className="p-2 rounded-frill bg-frill-100 text-frill-600"
          aria-label="Open properties"
        >
          <Settings size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between px-4 pb-3 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-frill border border-brand-border text-xs font-bold uppercase tracking-widest text-frill-600 disabled:opacity-50"
        >
          <Undo2 size={14} /> Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-frill border border-brand-border text-xs font-bold uppercase tracking-widest text-frill-600 disabled:opacity-50"
        >
          <Redo2 size={14} /> Redo
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-frill bg-magenta text-white text-xs font-bold uppercase tracking-widest"
        >
          <CheckCircle2 size={14} /> Confirm
        </button>
      </div>
    </div>
  )
}
