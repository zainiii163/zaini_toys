import { Link } from 'react-router-dom'
import { Shield, BookOpen, GraduationCap, ChevronRight } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Quality',
    description:
      'Every toy in our collection is hand-picked and tested to meet the highest quality standards. We partner only with trusted brands that share our commitment to excellence.',
  },
  {
    icon: BookOpen,
    title: 'Safety',
    description:
      'All our products meet international safety certifications including ASTM, EN71, and CE. Your child\'s safety is our top priority — no exceptions.',
  },
  {
    icon: GraduationCap,
    title: 'Education',
    description:
      'We believe play is learning. Our curated selection includes toys that spark creativity, improve motor skills, and make education fun for kids of all ages.',
  },
]

const team = [
  {
    name: 'Ahmed Khan',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Fatima Ali',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Hassan Malik',
    role: 'Product Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Ayesha Noor',
    role: 'Customer Experience Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-20">
        <div className="container-toy text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">About Toy Shop</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Pakistan's #1 online destination for safe, fun, and educational toys
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container-toy py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">Our Story</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            Founded in 2024, Toy Shop started with a simple mission: to make quality, safe, and educational
            toys accessible to every child in Pakistan. What began as a small family business in Karachi has
            grown into one of the country's most trusted online toy retailers.
          </p>
          <p className="mt-4 leading-relaxed text-gray-600">
            We work directly with leading international brands including LEGO, Mattel, Fisher-Price, Nerf,
            and Crayola. Our partnerships ensure authentic products and competitive pricing for Pakistani
            families — because every child deserves the best.
          </p>
          <p className="mt-4 leading-relaxed text-gray-600">
            Today, we serve thousands of happy customers across Pakistan with fast delivery, secure payments,
            and a curated collection of over 5,000 toys. Our journey is just beginning, and we're committed
            to bringing smiles to even more families.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="container-toy">
          <h2 className="font-display text-center text-2xl font-semibold">Our Values</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-toy p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-toy py-16">
        <h2 className="font-display text-center text-2xl font-semibold">Meet Our Team</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
          The passionate people behind Toy Shop who work every day to bring joy to kids across Pakistan.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="card-toy overflow-hidden text-center">
              <img
                src={member.image}
                alt={member.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-16">
        <div className="container-toy text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to Find the Perfect Toy?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-blue-100">
            Browse our curated collection of safe, fun, and educational toys for kids of all ages.
          </p>
          <Link
            to="/shop"
            className="btn-primary mt-6 inline-flex items-center bg-white !text-blue-700 hover:bg-gray-100"
          >
            Shop Now <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
