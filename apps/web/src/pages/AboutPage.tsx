import { Shield, Truck, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container-toy py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">About Toy Shop</h1>
        <p className="text-gray-500 mb-8">Pakistan's trusted destination for quality toys</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Our Story</h2>
            <p>
              Founded in 2024, Toy Shop started with a simple mission: to make quality, safe, and educational toys
              accessible to every child in Pakistan. What began as a small family business has grown into one of
              the country's most trusted online toy retailers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p>
              We believe every child deserves access to toys that are not only fun but also contribute to their
              growth and development. We carefully curate our collection to include products that meet international
              safety standards while being affordable for Pakistani families.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Why Choose Us?</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              {[
                { icon: Shield, title: 'Safe & Certified', desc: 'All products meet international safety standards (ASTM, EN71, CE)' },
                { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery in Karachi & Lahore, 3-5 days nationwide' },
                { icon: Heart, title: 'Curated Selection', desc: 'Every toy is hand-picked for quality, durability, and educational value' },
                { icon: Award, title: 'Best Prices', desc: 'Competitive prices with exclusive deals and loyalty rewards' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <Icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Our Partners</h2>
            <p>
              We work directly with leading international brands including LEGO, Mattel (Hot Wheels, Barbie),
              Fisher-Price, Nerf, Crayola, and many more. Our partnerships ensure authentic products and
              competitive pricing for our customers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
            <p>
              Have questions? We're here to help! Reach out to us at{' '}
              <strong>support@toyshop.pk</strong> or call <strong>0300-1234567</strong>.
              Our team is available Monday through Saturday, 9AM to 8PM.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
