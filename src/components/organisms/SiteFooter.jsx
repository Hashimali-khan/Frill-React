import { Link } from 'react-router-dom'
import { Globe, Mail, Heart, MapPin } from 'lucide-react'

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products',     href: '/collections' },
      { label: 'Hoodies',           href: '/collections?cat=hoodie' },
      { label: 'T-Shirts',          href: '/collections?cat=tshirt' },
      { label: 'Bags & Accessories', href: '/collections?cat=bags' },
      { label: 'Bulk Orders',        href: '/bulk' },
    ],
  },
  {
    heading: 'Create',
    links: [
      { label: 'Design Studio',    href: '/studio/new' },
      { label: 'Templates',         href: '/templates' },
      { label: 'Upload Your Art',   href: '/studio/new?tab=upload' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'FAQ',             href: '/faq' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Returns',         href: '/returns' },
      { label: 'Contact Us',      href: '/contact' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="bg-frill-800 text-white/70">
      <div className="section-inner py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="font-head text-3xl font-black text-white tracking-tight mb-2">
              Fr<span className="text-magenta">i</span>ll
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-65">
              Pakistan's premium Print-on-Demand platform. No minimum order.
              Nationwide delivery.
            </p>
            <div className="flex items-center gap-1.5 text-xs mb-6">
              <MapPin size={13} className="text-magenta" />
              Karachi, Lahore, Islamabad
            </div>
            <div className="flex gap-3">
              {[Globe, Mail, Heart].map((Icon, i) => (
                <a key={i} href="#"
                   className="w-9 h-9 rounded-frill bg-white/5 flex items-center
                               justify-center hover:bg-magenta transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map(col => (
            <div key={col.heading}>
              <h4 className="font-head text-xs font-bold uppercase tracking-widest
                              text-white mb-4">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-inner py-5 flex flex-wrap items-center
                        justify-between gap-4 text-xs">
          <span>© {new Date().getFullYear()} Frill. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span className="text-white/40">Secure payments via:</span>
            {/* Payment logos — replace with actual SVGs */}
            <span className="bg-white/10 text-white/60 text-[.65rem] font-head
                             font-bold px-2 py-1 rounded">JazzCash</span>
            <span className="bg-white/10 text-white/60 text-[.65rem] font-head
                             font-bold px-2 py-1 rounded">Easypaisa</span>
            <span className="bg-white/10 text-white/60 text-[.65rem] font-head
                             font-bold px-2 py-1 rounded">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}