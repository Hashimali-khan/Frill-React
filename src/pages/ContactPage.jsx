import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-white to-magenta/5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple to-magenta py-16 text-white">
        <div className="section-inner">
          <h1 className="font-head text-4xl sm:text-5xl font-black mb-3">Get In Touch</h1>
          <p className="text-lg text-white/90">
            Have a question or feedback? We'd love to hear from you. Reach out anytime!
          </p>
        </div>
      </div>

      <div className="section-inner py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="font-head text-2xl font-black text-frill-900 mb-8">Contact Information</h2>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-frill-lg bg-gradient-to-br from-purple/20 to-magenta/20 flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-purple" />
              </div>
              <div>
                <h3 className="font-head font-black text-frill-900 mb-1">Email</h3>
                <a href="mailto:hello@frill.pk" className="text-magenta font-semibold hover:text-magenta-hot transition-colors">
                  hello@frill.pk
                </a>
                <p className="text-sm text-frill-500 mt-1">We'll respond within 24 hours</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-frill-lg bg-gradient-to-br from-magenta/20 to-purple/20 flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-magenta" />
              </div>
              <div>
                <h3 className="font-head font-black text-frill-900 mb-1">Phone</h3>
                <a href="tel:+923001234567" className="text-purple font-semibold hover:text-purple/80 transition-colors">
                  +92 (300) 123-4567
                </a>
                <p className="text-sm text-frill-500 mt-1">Mon–Fri, 9am–6pm PST</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-frill-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="font-head font-black text-frill-900 mb-1">Office</h3>
                <p className="text-frill-600 font-semibold">
                  Karachi, Pakistan
                </p>
                <p className="text-sm text-frill-500 mt-1">Visit us or drop by</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-frill-200">
              <h3 className="font-head font-black text-frill-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-frill bg-purple text-white flex items-center justify-center hover:bg-magenta transition-colors font-bold">
                  f
                </a>
                <a href="#" className="w-10 h-10 rounded-frill bg-magenta text-white flex items-center justify-center hover:bg-purple transition-colors font-bold">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 rounded-frill bg-purple text-white flex items-center justify-center hover:bg-magenta transition-colors font-bold">
                  in
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-frill-lg border border-frill-200 p-8 shadow-frill-sm">
            <h2 className="font-head text-2xl font-black text-frill-900 mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-frill-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-frill-300 rounded-frill focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all"
                  placeholder="Hassan Ahmed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-frill-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-frill-300 rounded-frill focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-frill-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-frill-300 rounded-frill focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-frill-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-frill-300 rounded-frill focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple to-magenta text-white font-head font-black uppercase tracking-wider rounded-frill-lg hover:from-purple/90 hover:to-magenta/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={18} />
                Send Message
              </button>

              <p className="text-xs text-frill-500 text-center">
                We'll get back to you as soon as possible.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-frill-200 py-16">
        <div className="section-inner max-w-3xl">
          <h2 className="font-head text-3xl font-black text-frill-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How long does shipping take?",
                a: "Orders are processed within 2-3 business days. Shipping typically takes 5-7 business days depending on your location."
              },
              {
                q: "What's your return policy?",
                a: "We offer a 30-day return policy for unused items in original packaging. Contact us for assistance."
              },
              {
                q: "Do you offer custom designs?",
                a: "Yes! Use our Design Studio to create custom pieces or contact us for bulk custom orders."
              },
              {
                q: "Are there international shipping options?",
                a: "Currently, we ship within Pakistan. International shipping options coming soon!"
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-frill-200 rounded-frill-lg p-6">
                <h3 className="font-head font-bold text-frill-900 mb-2">{faq.q}</h3>
                <p className="text-frill-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
