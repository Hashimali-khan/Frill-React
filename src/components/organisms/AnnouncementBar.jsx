import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Default announcement messages — replace with CMS data in Sprint 2 */
const DEFAULT_MESSAGES = [
  { id: 1, text: '🎨 Free Customisation on all orders this week!', cta: { label: 'Shop Now', href: '/collections' } },
  { id: 2, text: '🚚 Free delivery on orders above Rs. 2,000', cta: null },
  { id: 3, text: 'اب اردو ٹائپوگرافی کے ساتھ اپنے کپڑے کسٹمائز کریں', urdu: true, cta: null },
]

export default function AnnouncementBar({
  messages = DEFAULT_MESSAGES,
  rotateInterval = 5000,
}) {
  const [visible, setVisible]   = useState(true)
  const [current, setCurrent]   = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % messages.length)
    }, rotateInterval)
    return () => clearInterval(interval)
  }, [messages.length, rotateInterval])

  if (!visible) return null

  const msg = messages[current]

  return (
    <div className="bg-purple relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{   opacity: 0, y:  8 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center gap-3 px-10 py-[0.55rem]"
        >
          <span
            className={`font-head text-[.72rem] font-semibold tracking-widest
                        uppercase text-white
                        ${msg.urdu ? 'urdu normal-case tracking-normal text-sm' : ''}`}
          >
            {msg.text}
          </span>

          {msg.cta && (
            <Link
              to={msg.cta.href}
              className="text-magenta-hot text-[.72rem] font-bold border-b border-current ml-1"
            >
              {msg.cta.label}
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-white/40 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}