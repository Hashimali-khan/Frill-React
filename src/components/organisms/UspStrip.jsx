import { Truck, Palette, ShieldCheck, Phone } from 'lucide-react'

const USP_ITEMS = [
  { icon: Truck,       text: 'Free Delivery above Rs. 2,000' },
  { icon: Palette,     text: 'Free Customisation' },
  { icon: ShieldCheck, text: '200-Wash Colour Guarantee' },
  { icon: Phone,       text: 'SMS Order Tracking' },
]

export default function UspStrip() {
  return (
    <div className="bg-frill-50 border-b border-brand-border py-2.5">
      <ul className="section-inner flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
        {USP_ITEMS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-1.5
                                    font-head text-[.72rem] font-semibold
                                    tracking-[.02em] text-frill-600">
            <Icon size={14} className="text-magenta shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}