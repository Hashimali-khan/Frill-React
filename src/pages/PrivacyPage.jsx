import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-frill-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-magenta to-purple py-12 text-white">
        <div className="section-inner">
          <Link to="/" className="text-sm font-semibold hover:opacity-80 transition-opacity mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-head text-4xl sm:text-5xl font-black mb-2">Privacy Policy</h1>
          <p className="text-white/80">Last updated: January 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="section-inner py-12 max-w-3xl">
        <div className="bg-white rounded-frill-lg border border-frill-200 p-8 space-y-8">
          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Introduction</h2>
            <p className="text-frill-600 leading-relaxed">
              Frill ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Information Collection and Use</h2>
            <p className="text-frill-600 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our website to you.
            </p>
            <div className="bg-frill-50 rounded-frill-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-frill-900 mb-2">Personal Data</h3>
                <p className="text-frill-600 text-sm">Email address, first name and last name, phone number, address, state, province, ZIP/postal code, city, cookies and usage data</p>
              </div>
              <div>
                <h3 className="font-semibold text-frill-900 mb-2">Usage Data</h3>
                <p className="text-frill-600 text-sm">We may also collect information about how the website is accessed and used ("Usage Data"), including information such as your computer's IP address, browser type, browser version, the pages you visit, and the time and date of your visit.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Use of Data</h2>
            <p className="text-frill-600 leading-relaxed mb-4">
              Frill uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-frill-600 space-y-2">
              <li>To provide and maintain our website</li>
              <li>To notify you about changes to our website</li>
              <li>To allow you to participate in interactive features when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so that we can improve our website</li>
              <li>To monitor the usage of our website</li>
              <li>To detect, prevent and address technical issues and fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Security of Data</h2>
            <p className="text-frill-600 leading-relaxed">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Contact Us</h2>
            <p className="text-frill-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please{' '}
              <Link to="/contact" className="text-magenta font-semibold hover:text-magenta-hot transition-colors">
                contact us
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl font-black text-frill-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-frill-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
          </section>

          <div className="pt-8 border-t border-frill-200 mt-8">
            <p className="text-sm text-frill-500">
              We are committed to ensuring that your privacy is protected. Should you have more questions regarding our privacy practices, please reach out.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
