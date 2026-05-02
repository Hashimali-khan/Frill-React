import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-frill-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple to-magenta py-12 text-white">
        <div className="section-inner">
          <Link to="/" className="text-sm font-semibold hover:opacity-80 transition-opacity mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-head text-4xl sm:text-5xl font-black mb-2">Terms & Conditions</h1>
          <p className="text-white/80">Last updated: January 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="section-inner py-12 max-w-3xl">
        <div className="bg-white rounded-frill-lg border border-frill-200 p-8 space-y-8">
          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-frill-600 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">2. Use License</h2>
            <p className="text-frill-600 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Frill's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-frill-600 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">3. Disclaimer</h2>
            <p className="text-frill-600 leading-relaxed">
              The materials on Frill's website are provided on an 'as is' basis. Frill makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">4. Limitations</h2>
            <p className="text-frill-600 leading-relaxed">
              In no event shall Frill or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Frill's website, even if Frill or a Frill authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-frill-600 leading-relaxed">
              The materials appearing on Frill's website could include technical, typographical, or photographic errors. Frill does not warrant that any of the materials on its website are accurate, complete, or current. Frill may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">6. Links</h2>
            <p className="text-frill-600 leading-relaxed">
              Frill has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Frill of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">7. Modifications</h2>
            <p className="text-frill-600 leading-relaxed">
              Frill may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">8. Governing Law</h2>
            <p className="text-frill-600 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <div className="pt-8 border-t border-frill-200 mt-8">
            <p className="text-sm text-frill-500">
              For questions about these Terms, please{' '}
              <Link to="/contact" className="text-magenta font-semibold hover:text-magenta-hot transition-colors">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
