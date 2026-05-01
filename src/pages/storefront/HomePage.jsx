import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Palette,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
  ArrowUpRight,
} from 'lucide-react'
import ProductCard from '@/components/organisms/ProductCard'
import { PRODUCTS_MOCK } from '@/data/products.mock'

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Free Delivery above Rs. 2,000',
    text: 'Fast nationwide shipping on qualifying orders.',
  },
  {
    icon: BadgeCheck,
    title: '200-Wash Colour Guarantee',
    text: 'Premium inks and fabrics that hold up beautifully.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    text: 'Safe payments and a smooth order flow every time.',
  },
  {
    icon: Clock3,
    title: 'Rapid Turnaround',
    text: 'Design today, print and ship with speed.',
  },
]

const PROCESS_STEPS = [
  {
    icon: Shirt,
    title: 'Pick a Garment',
    text: 'Choose the base piece that fits your brand, team, or drop.',
  },
  {
    icon: Palette,
    title: 'Design in Studio',
    text: 'Drop in your artwork, logos, Urdu text, and custom colors.',
  },
  {
    icon: Truck,
    title: 'We Print & Ship',
    text: 'We handle production, packing, and delivery across Pakistan.',
  },
]

const TRENDING_PRODUCTS = PRODUCTS_MOCK.slice(0, 4)

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const sectionStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

function HomeHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-purple/20 via-magenta/10 to-frill-100 blur-3xl" />
      <div className="grid grid-cols-2 gap-3 rounded-4xl bg-white/70 backdrop-blur-xl border border-white/60 p-3 shadow-2xl">
        <div className="relative overflow-hidden rounded-3xl min-h-76 lg:min-h-124 bg-frill-100">
          <img
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&auto=format&fit=crop&q=80"
            alt="Lifestyle model wearing custom apparel"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-frill-800/70 via-frill-800/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 rounded-frill-lg bg-white/15 backdrop-blur-md border border-white/20 p-4 text-white">
            <p className="font-head text-[.65rem] uppercase tracking-[.18em] text-white/70 mb-1">Streetwear energy</p>
            <p className="font-head text-lg font-black leading-tight">Premium blanks made for bold brands.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-3xl bg-purple text-white p-5 lg:p-6 min-h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60 text-xs uppercase tracking-[.18em] font-head font-bold">
              <span>Studio-ready</span>
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-head text-[.68rem] uppercase tracking-[.2em] text-white/55 mb-2">Print preview</p>
              <p className="font-head text-xl lg:text-2xl font-black leading-tight max-w-[11ch]">Mockup to production in one flow.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-frill-50 min-h-60 flex items-end p-4 border border-brand-border">
            <img
              src={PRODUCTS_MOCK[0].imgs?.[0] || PRODUCTS_MOCK[0].img}
              alt={PRODUCTS_MOCK[0].name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-purple/75 via-purple/20 to-transparent" />
            <div className="relative z-10 w-full rounded-frill-lg bg-white/85 backdrop-blur-md border border-white/50 p-4 shadow-lg">
              <p className="font-head text-[.65rem] uppercase tracking-[.18em] text-frill-400 mb-1">Trending blank</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-head text-base font-black text-purple">Classic Custom Hoodie</p>
                  <p className="text-sm text-frill-500">From Rs. 2,499</p>
                </div>
                <ArrowUpRight className="text-magenta shrink-0" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate bg-linear-to-b from-white via-frill-50 to-white">
        <div className="absolute inset-x-0 top-0 h-136 bg-[radial-gradient(circle_at_top_right,rgba(194,24,91,0.12),transparent_34%),radial-gradient(circle_at_top_left,rgba(59,31,94,0.12),transparent_28%)]" />
        <div className="section-inner relative py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-6"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-magenta/20 bg-magenta/5 px-4 py-2 text-xs font-head font-bold uppercase tracking-[.2em] text-magenta mb-6">
              <Sparkles size={14} /> Custom Apparel, reimagined
            </div>
            <h1 className="font-head text-4xl sm:text-5xl lg:text-7xl font-black leading-[.92] text-purple tracking-tight max-w-[10ch]">
              Wear Your Imagination.
              <span className="block text-magenta mt-2">Premium Custom Apparel.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-frill-600 leading-relaxed">
              Build custom hoodies, tees, and teamwear that look premium from the first click to the final delivery.
              Fast production, bold prints, and a studio that makes designing feel effortless.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 bg-magenta text-white font-head text-sm font-black uppercase tracking-[.16em] px-6 py-4 rounded-frill-lg hover:bg-magenta-hot transition-all shadow-frill-md"
              >
                Design Your Own <ArrowRight size={16} />
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 border-2 border-purple text-purple font-head text-sm font-black uppercase tracking-[.16em] px-6 py-4 rounded-frill-lg hover:bg-purple hover:text-white transition-all"
              >
                Shop Exclusives
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['No minimums', 'Fast dispatch', 'Premium fabrics', 'Built for teams'].map((chip) => (
                <span key={chip} className="rounded-full bg-white border border-brand-border px-4 py-2 text-xs font-medium text-frill-500 shadow-sm">
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <HomeHeroVisual />
          </motion.div>
        </div>
      </section>

      <section className="bg-frill-50 border-y border-brand-border">
        <div className="section-inner py-5 lg:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-frill-lg bg-white border border-brand-border p-4 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-frill bg-purple/10 text-purple flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-head text-sm font-black text-purple leading-tight">{item.title}</p>
                    <p className="text-xs text-frill-500 mt-1 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-inner py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <p className="font-head text-[0.65rem] font-bold uppercase tracking-[.2em] text-magenta mb-2">Trending Now</p>
            <h2 className="font-head text-2xl sm:text-3xl lg:text-4xl font-black text-purple">Trending Blanks</h2>
          </div>
          <Link to="/collections" className="hidden sm:inline-flex items-center gap-2 font-head text-sm font-bold uppercase tracking-[.14em] text-purple hover:text-magenta transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {TRENDING_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link to="/collections" className="inline-flex items-center gap-2 font-head text-sm font-bold uppercase tracking-[.14em] text-purple hover:text-magenta transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="section-inner">
          <div className="max-w-2xl mb-10">
            <p className="font-head text-[0.65rem] font-bold uppercase tracking-[.2em] text-magenta mb-2">How It Works</p>
            <h2 className="font-head text-2xl sm:text-3xl lg:text-4xl font-black text-purple">From blank to brand in three steps</h2>
            <p className="mt-4 text-frill-600 leading-relaxed">
              The process is intentionally simple: choose a garment, create your artwork in the studio, and let us print and ship it for you.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            variants={sectionStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  variants={cardReveal}
                  className="rounded-frill-lg border border-brand-border bg-frill-50 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-full bg-purple text-white flex items-center justify-center font-head text-lg font-black">
                      0{index + 1}
                    </div>
                    <Icon className="text-magenta" size={24} />
                  </div>
                  <h3 className="font-head text-xl font-black text-purple mb-2">{step.title}</h3>
                  <p className="text-sm text-frill-600 leading-relaxed">{step.text}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section id="bulk-orders" className="section-inner py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-4xl bg-purple text-white p-6 sm:p-8 shadow-2xl">
            <p className="font-head text-[0.65rem] font-bold uppercase tracking-[.2em] text-white/70 mb-2">Bulk Orders</p>
            <h2 className="font-head text-2xl sm:text-3xl lg:text-4xl font-black leading-tight max-w-[12ch]">Uniforms, merch drops, event kits, and branded gifts.</h2>
            <p className="mt-4 text-white/80 leading-relaxed max-w-2xl">
              Need 25 or 2,500 pieces? We handle custom quotes, print guidance, and coordinated production for teams and businesses.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-magenta text-white font-head text-sm font-black uppercase tracking-[.16em] px-5 py-3 rounded-frill-lg hover:bg-magenta-hot transition-colors">
                Request a Quote <ArrowRight size={16} />
              </Link>
              <Link to="/collections" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-head text-sm font-black uppercase tracking-[.16em] px-5 py-3 rounded-frill-lg hover:bg-white hover:text-purple transition-colors">
                Browse Products
              </Link>
            </div>
          </div>

          <div id="about" className="lg:col-span-5 rounded-4xl bg-frill-50 border border-brand-border p-6 sm:p-8">
            <p className="font-head text-[0.65rem] font-bold uppercase tracking-[.2em] text-magenta mb-2">About Frill</p>
            <h2 className="font-head text-2xl sm:text-3xl font-black text-purple leading-tight">A premium custom apparel brand built for modern creators.</h2>
            <p className="mt-4 text-frill-600 leading-relaxed">
              We combine elevated garments, design freedom, and fast fulfilment so your merch feels as intentional as the brand behind it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Bold branding', 'Clean fit', 'Premium print', 'Pakistan-wide'].map((tag) => (
                <span key={tag} className="rounded-full bg-white border border-brand-border px-3 py-1 text-xs font-medium text-frill-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
