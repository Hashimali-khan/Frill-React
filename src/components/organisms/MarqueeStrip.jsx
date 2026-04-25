/**
 * MarqueeStrip — Infinite scrolling text ribbon.
 * Uses CSS animation (hardware-accelerated).
 * Duplicates content to create a seamless loop.
 */
const MARQUEE_ITEMS = [
  '✦ Free Customisation',
  '✦ No Minimum Order',
  '✦ DTG Printing',
  '✦ اردو ٹائپوگرافی',
  '✦ 5-Day Delivery',
  '✦ JazzCash & Easypaisa',
  '✦ 200-Wash Guarantee',
]

export default function MarqueeStrip() {
  return (
    <div className="bg-magenta py-3.5 overflow-hidden" aria-hidden="true">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Render twice for seamless loop — tailwind config has translateX(-50%) */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="font-head text-[.75rem] font-bold tracking-[.12em]
                        uppercase text-white px-8"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}