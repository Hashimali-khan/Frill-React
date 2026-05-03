import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Heart, Eye, Star, Palette } from 'lucide-react'
import { addItem } from '@/features/cart/cartSlice'
import { formatPKR } from '@/utils/currency'
import { cn } from '@/utils/cn'
import { useToast } from '@/hooks/useToast'

const BADGE_STYLES = {
  new:    'bg-magenta text-white',
  custom: 'bg-purple text-white',
  sale:   'bg-green-600 text-white',
}

export default function ProductCard({ product, className }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const primaryColor = product.colors?.[0]
  const primaryView = primaryColor?.views?.[0]
  const imageSrc = primaryView?.imageUrl || product.imgs?.[0] || product.img

  function handleAddToCart(e) {
    // 1. Crucial: Stop the <Link> from navigating to the detail page
    e.preventDefault() 
    e.stopPropagation() 

    // 2. Dispatch to Redux (Client State)
    dispatch(addItem({ 
      product, 
      quantity: 1, 
      // Fallback logic for safety
      selectedSize: product.sizes?.[0] || 'M', 
      selectedColor: primaryColor
        ? { id: primaryColor.id, name: primaryColor.name, hex: primaryColor.hex }
        : '#000',
      selectedView: primaryView ? { id: primaryView.id, label: primaryView.label } : null,
    }))

    toast.success(`🛒 Added ${product.name} to cart!`)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        // v4 layout: group for hover effects, transition for lift effect
        'group bg-white rounded-frill-lg overflow-hidden border border-brand-border',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-frill-lg block',
        className
      )}
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative overflow-hidden aspect-3/4 bg-frill-100">
        <img
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Dynamic Badge */}
        {product.badge && (
          <span className={cn(
            'absolute top-3 left-3 font-head text-[.62rem] font-extrabold tracking-[.08em]',
            'uppercase px-2.5 py-1 rounded shadow-sm',
            BADGE_STYLES[product.badgeVariant] || 'bg-purple text-white'
          )}>
            {product.badge}
          </span>
        )}

        {/* Customise Indicator */}
        {product.customizable && (
          <span className="absolute top-3 right-3 bg-purple/90 text-white backdrop-blur-sm
                            font-head text-[.58rem] font-bold tracking-wide
                            uppercase px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <Palette size={10} /> Customise
          </span>
        )}

        {/* Floating Action Buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5
                         opacity-0 translate-x-4 group-hover:opacity-100
                         group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={e => { e.preventDefault(); toast('♡ Saved to wishlist!') }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center
                        shadow-frill-md hover:bg-magenta hover:text-white transition-colors"
            title="Add to Wishlist"
          ><Heart size={15} /></button>
          
          {/* Quick View (Eye) */}
          <button
            onClick={e => { e.preventDefault(); /* Open Modal Logic */ }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center
                        shadow-frill-md hover:bg-purple hover:text-white transition-colors"
             title="Quick View"
          ><Eye size={15} /></button>
        </div>
      </div>

      {/* --- INFO SECTION --- */}
      <div className="p-4 pb-5">
        <p className="font-head text-[.65rem] font-semibold tracking-widest uppercase text-frill-400 mb-1">
          {product.vendor}
        </p>
        <h3 className="font-head text-[.9rem] font-bold text-purple mb-1.5 leading-snug group-hover:text-magenta transition-colors">
          {product.name}
        </h3>
        
        <p className="text-[.78rem] text-frill-400 leading-relaxed mb-3 line-clamp-2">
          {product.desc}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="font-head text-base font-extrabold text-purple">
            {product.oldPrice && (
              <span className="text-[.78rem] font-medium text-frill-400 line-through mr-1.5 opacity-60">
                {formatPKR(product.oldPrice)}
              </span>
            )}
            {formatPKR(product.price)}
          </div>
          
          <div className="flex items-center gap-1 text-[.75rem]">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-frill-600">{product.stars}</span>
            <span className="text-frill-400">({product.reviews})</span>
          </div>
        </div>

        {/* Main CTA */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 bg-purple text-white font-head text-[.75rem]
                      font-extrabold tracking-[.06em] uppercase rounded-frill
                      transition-all hover:bg-magenta active:scale-[0.98]"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  )
}