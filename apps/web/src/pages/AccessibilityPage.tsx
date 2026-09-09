import { Link } from 'react-router-dom'

export default function AccessibilityPage() {
  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Accessibility</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-6">Accessibility Statement</h1>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <p>
            Toy Shop Pakistan is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">Our Commitment</h2>
          <p>
            We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">Measures Taken</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Semantic HTML structure with proper headings and landmarks</li>
            <li>Keyboard navigation support for all interactive elements</li>
            <li>Alt text for all product images</li>
            <li>Sufficient color contrast ratios for text and backgrounds</li>
            <li>Form labels and error messages associated with inputs</li>
            <li>Focus indicators for keyboard users</li>
            <li>Responsive design that works on all screen sizes</li>
            <li>Screen reader friendly content and navigation</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">Known Limitations</h2>
          <p>
            While we strive to ensure accessibility across our platform, there may be some areas that need improvement:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Some older product images may lack complete alt text</li>
            <li>Third-party payment forms may not fully comply with WCAG standards</li>
            <li>User-generated content (reviews) may not be fully accessible</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of Toy Shop Pakistan. Please let us know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Email: accessibility@toystore.pk</li>
            <li>Phone: +92 300 1234567</li>
            <li>Contact form: <Link to="/contact" className="text-blue-600 hover:underline">/contact</Link></li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">Assessment Approach</h2>
          <p>
            Toy Shop Pakistan assessed the accessibility of this website using self-evaluation tools and manual testing with assistive technologies including screen readers and keyboard-only navigation.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">Compatibility</h2>
          <p>This website is designed to be compatible with:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Latest versions of Chrome, Firefox, Safari, and Edge</li>
            <li>NVDA and JAWS screen readers on Windows</li>
            <li>VoiceOver on macOS and iOS</li>
            <li>TalkBack on Android</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
