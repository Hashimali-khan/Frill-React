import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Palette, ShieldCheck, Star, ChevronLeft, ShoppingBag, Package } from 'lucide-react'
import { useGetProductBySlugQuery } from '@/features/products/productsApi'
import { addItem } from '@/features/cart/cartSlice'
import { formatPKR } from '@/utils/currency'
import { cn } from '@/utils/cn'
import QuantityInput from '@/components/molecules/QuantityInput'

const DEFAULT_SIZE_INDEX = 2

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { data: product, isLoading } = useGetProductBySlugQuery({ slug })

  const [activeColor, setActiveColor] = useState(0)
  const [activeView, setActiveView] = useState(0)
  const [activeSize, setActiveSize] = useState(DEFAULT_SIZE_INDEX)
  const [qty, setQty] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const selectedColorIdFromState = location.state?.selectedColorId
  const selectedViewIdFromState = location.state?.selectedViewId

  useEffect(() => {
    if (!product) return

    const colorIndex = selectedColorIdFromState
      ? product.colors?.findIndex((color) => color.id === selectedColorIdFromState)
      : 0
    const nextColorIndex = colorIndex >= 0 ? colorIndex : 0
    setActiveColor(nextColorIndex)

    const views = product.colors?.[nextColorIndex]?.views || []
    const viewIndex = selectedViewIdFromState
      ? views.findIndex((view) => view.id === selectedViewIdFromState)
      : 0
    setActiveView(viewIndex >= 0 ? viewIndex : 0)

    setActiveSize(Math.min(DEFAULT_SIZE_INDEX, Math.max((product.sizes?.length || 1) - 1, 0)))
    setQty(1)
  }, [product, selectedColorIdFromState, selectedViewIdFromState])

  const selectedColor = useMemo(() => {
    if (!product?.colors?.length) return null
    return product.colors[activeColor] || product.colors[0]
  }, [activeColor, product])

  const selectedView = useMemo(() => {
    if (!selectedColor?.views?.length) return null
    return selectedColor.views[activeView] || selectedColor.views[0]
  }, [activeView, selectedColor])

  useEffect(() => {
    if (!selectedColor?.views?.length) return
    if (activeView >= selectedColor.views.length) {
      setActiveView(0)
    }
  }, [activeView, selectedColor])

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple/20 border-t-purple rounded-full animate-spin" />
        <p className="font-head text-sm font-bold text-purple uppercase tracking-widest">Loading Frill...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-head text-2xl font-black text-purple mb-4">Product Not Found</h2>
        <Link to="/collections" className="text-magenta font-bold hover:underline">Back to Shop</Link>
      </div>
    )
  }

  function handleAddToCart() {
    setIsAdding(true)

    dispatch(
      addItem({
        product,
        quantity: qty,
        selectedSize: product.sizes?.[activeSize] || 'M',
        selectedColor: selectedColor
          ? { id: selectedColor.id, name: selectedColor.name, hex: selectedColor.hex }
          : '#000',
        selectedView: selectedView ? { id: selectedView.id, label: selectedView.label } : null,
      })
    )

    window.setTimeout(() => setIsAdding(false), 800)
  }

  function handleDesignClick() {
    navigate(`/studio/${product.id}`, {
      state: {
        selectedColorId: selectedColor?.id,
        selectedViewId: selectedView?.id,
      },
    })
  }

  return (
    <div className="section-inner py-8 lg:py-10">
      <nav className="text-[0.65rem] text-frill-400 font-head mb-8 flex items-center gap-2 uppercase tracking-wider">
        <Link to="/" className="hover:text-purple transition-colors">Home</Link>
        <span className="opacity-30">/</span>
        <Link to="/collections" className="hover:text-purple transition-colors">Shop</Link>
        <span className="opacity-30">/</span>
        <span className="text-purple font-bold truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {(selectedColor?.views || []).map((view, index) => (
              <button
                key={`${view.id}-${index}`}
                onClick={() => setActiveView(index)}
                className={cn(
                  'w-20 h-24 shrink-0 rounded-frill overflow-hidden border-2 transition-all',
                  activeView === index ? 'border-purple shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                )}
                type="button"
              >
                <img src={view.imageUrl} alt={view.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 rounded-frill-lg overflow-hidden bg-frill-100 aspect-4/5 shadow-sm">
            {selectedView ? (
              <img
                src={selectedView.imageUrl}
                alt={`${product.name} ${selectedView.label}`}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <div className="mb-6">
            <p className="font-head text-[.7rem] font-bold tracking-[.15em] uppercase text-magenta mb-2">
              {product.vendor}
            </p>
            <h1 className="font-head text-3xl font-black text-purple leading-none mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-head text-[.8rem] font-bold text-amber-700">{product.stars}</span>
              </div>
              <span className="text-frill-400 text-xs font-medium underline underline-offset-4 cursor-pointer">
                {product.reviews} Verified Reviews
              </span>
            </div>
          </div>

          <div className="font-head text-3xl font-black text-purple mb-8 flex items-baseline gap-3">
            {formatPKR(product.price)}
            {product.oldPrice && (
              <span className="text-lg font-medium text-frill-400 line-through">
                {formatPKR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="font-head text-xs font-bold uppercase tracking-widest text-purple">Selected Colour</span>
              <span className="text-xs font-medium text-frill-400">
                {selectedColor?.name || selectedColor?.hex || '—'}
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.colors?.map((color, index) => (
                <button
                  key={color.id}
                  onClick={() => {
                    setActiveColor(index)
                    setActiveView(0)
                  }}
                  style={{ background: color.hex }}
                  className={cn(
                    'w-9 h-9 rounded-full border-2 ring-offset-2 transition-all hover:scale-110',
                    activeColor === index ? 'border-purple ring-2 ring-purple/20' : 'border-brand-border'
                  )}
                  type="button"
                  aria-label={`Select color ${color.name}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="font-head text-xs font-bold uppercase tracking-widest text-purple">Select Size</span>
              <button type="button" className="text-[0.65rem] font-bold text-magenta uppercase hover:underline">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes?.map((size, index) => (
                <button
                  key={size}
                  onClick={() => setActiveSize(index)}
                  type="button"
                  className={cn(
                    'font-head text-xs font-bold py-3 rounded-frill border-2 transition-all',
                    activeSize === index
                      ? 'bg-purple text-white border-purple shadow-lg -translate-y-0.5'
                      : 'border-brand-border text-frill-600 hover:border-purple bg-white'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[0.7rem] uppercase tracking-wider font-bold text-frill-400 mb-2">
              Description
            </div>
            <p className="text-frill-600 leading-relaxed">
              {product.longDesc || product.desc}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex gap-4">
              <QuantityInput value={qty} onChange={setQty} />
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                type="button"
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-4 rounded-frill font-head text-sm font-black uppercase tracking-widest transition-all',
                  isAdding ? 'bg-green-600 text-white' : 'bg-purple text-white hover:bg-purple-mid shadow-frill-md'
                )}
              >
                <ShoppingBag size={18} />
                {isAdding ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            {product.customizable && (
              <button
                onClick={handleDesignClick}
                type="button"
                className="w-full bg-white border-2 border-magenta text-magenta font-head text-sm font-black tracking-widest uppercase rounded-frill py-4 hover:bg-magenta hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <Palette size={18} /> Design Your Own
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-brand-border">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-magenta shrink-0" size={24} />
              <span className="text-[0.7rem] font-bold text-frill-800 uppercase leading-tight">Secure <br />Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="text-magenta shrink-0" size={24} />
              <span className="text-[0.7rem] font-bold text-frill-800 uppercase leading-tight">Fast <br />Dispatch</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              to="/collections"
              className="flex-1 border border-brand-border font-head text-sm font-bold text-frill-600 py-3 rounded-frill hover:border-purple transition-colors text-center"
            >
              <ChevronLeft size={16} className="inline-block mr-1" /> Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
