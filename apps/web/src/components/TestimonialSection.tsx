import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Ahmed',
    rating: 5,
    review:
      'Absolutely love the quality of toys! My kids are obsessed with the LEGO sets we ordered. Delivery was super fast and everything came perfectly packaged.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Bilal Hassan',
    rating: 5,
    review:
      "Best online toy shop in Pakistan! The prices are competitive and the COD option makes it so convenient. Will definitely order again for my nephew's birthday.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Maria Khan',
    rating: 4,
    review:
      "Great collection of educational toys. I bought the Montessori set for my daughter and she absolutely loves it. Customer support was also very helpful when I had a query.",
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
  },
]

export default function TestimonialSection() {
  return (
    <section className="container-toy py-12">
      <h2 className="mb-8 font-display text-2xl font-semibold">What Parents Say</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="card-toy p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">"{t.review}"</p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-gray-400">Verified Buyer</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
