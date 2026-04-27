import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Instagram, Mail, MapPin, Youtube } from 'lucide-react'

const QUICK_LINKS = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'Shop', href: '/collections' },
      { label: 'Customise', href: '/studio/new' },
      { label: 'Track Order', href: '/track-order' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'FAQs', href: '/faq' },
      { label: 'Return Policy', href: '/returns' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="bg-frill-800 text-white/75">
      <div className="section-inner py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-12">
          <div className="xl:col-span-1">
            <div className="font-head text-3xl font-black text-white tracking-tight mb-3">
              Fr<span className="text-magenta">i</span>ll
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Premium custom apparel built for creators, teams, and brands. Design it, wear it, ship it nationwide.
            </p>
            <div className="flex items-center gap-2 text-xs mt-5">
              <MapPin size={13} className="text-magenta" />
              Karachi, Lahore, Islamabad
            </div>
            <div className="flex gap-3 mt-6">
              {[Globe, Instagram, Youtube, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-frill bg-white/5 flex items-center justify-center hover:bg-magenta transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {QUICK_LINKS.map((column) => (
            <div key={column.heading}>
              <h4 className="font-head text-xs font-bold uppercase tracking-widest text-white mb-4">
                {column.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-head text-xs font-bold uppercase tracking-widest text-white mb-4">
              Newsletter
            </h4>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Get early access to drops, custom design ideas, and limited-time offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-frill px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-magenta"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-magenta text-white font-head text-xs font-bold uppercase tracking-widest px-4 rounded-frill hover:bg-magenta-hot transition-colors"
              >
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-inner py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <span>© {new Date().getFullYear()} Frill. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/40 mr-1">Secure payments via:</span>
            <span className="bg-white/10 text-white/70 text-[.65rem] font-head font-bold px-2 py-1 rounded">JazzCash</span>
            <span className="bg-white/10 text-white/70 text-[.65rem] font-head font-bold px-2 py-1 rounded">Easypaisa</span>
            <span className="bg-white/10 text-white/70 text-[.65rem] font-head font-bold px-2 py-1 rounded">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}