export default function PrivacyPage() {
  return (
    <div className="container-toy py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, shipping addresses, payment information, and order history. We also collect automatic data like IP address, browser type, and browsing activity on our site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order updates and delivery notifications</li>
            <li>Provide customer support</li>
            <li>Personalize your shopping experience</li>
            <li>Send promotional offers (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p>We do not sell your personal information. We share data only with: delivery partners (for order fulfillment), payment processors (for transactions), and analytics services (anonymized data). All partners are contractually obligated to protect your information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p>We use industry-standard encryption (SSL) to protect your data. Payment information is processed securely through our payment partners and is never stored on our servers. However, no method of transmission is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
          <p>We use essential cookies for site functionality and optional cookies for analytics and marketing. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide services. Order data is retained for 7 years for legal and accounting purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
          <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Significant changes will be notified via email or website announcement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
          <p>For privacy-related inquiries, contact our Data Protection Officer at <strong>privacy@toyshop.pk</strong> or write to us at our registered address in Karachi, Pakistan.</p>
        </section>
      </div>
    </div>
  )
}
