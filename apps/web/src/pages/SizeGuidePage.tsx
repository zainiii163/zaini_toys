import { Link } from 'react-router-dom'

const AGE_SIZES = [
  { age: '0–6 Months', weight: '4–7 kg', height: '60–67 cm', examples: 'Soft toys, rattles, teethers, play mats' },
  { age: '6–12 Months', weight: '7–9 kg', height: '67–76 cm', examples: 'Stacking rings, shape sorters, ride-on toys, musical toys' },
  { age: '1–2 Years', weight: '9–12 kg', height: '76–89 cm', examples: 'Push walkers, simple puzzles, building blocks, pretend play' },
  { age: '2–3 Years', weight: '12–14 kg', height: '89–96 cm', examples: 'Tricycles, art supplies, dress-up, larger puzzles' },
  { age: '3–5 Years', weight: '14–18 kg', height: '96–110 cm', examples: 'Board games, bikes with training wheels, construction sets, science kits' },
  { age: '5–8 Years', weight: '18–25 kg', height: '110–128 cm', examples: 'LEGO sets, remote control cars, craft kits, strategy games' },
  { age: '8–12 Years', weight: '25–40 kg', height: '128–150 cm', examples: 'Electronics, complex building sets, sports equipment, board games' },
  { age: '12+ Years', weight: '40+ kg', height: '150+ cm', examples: 'Advanced kits, gaming accessories, STEM robots, outdoor sports' },
]

const TOY_SIZES: Record<string, string> = {
  'Mini (S)': 'Under 15 cm — stocking stuffers, pocket toys',
  'Small (M)': '15–30 cm — action figures, small dolls',
  'Medium (L)': '30–60 cm — plush toys, medium vehicles',
  'Large (XL)': '60–100 cm — ride-ons, large plush, playhouses',
  'Extra Large (XXL)': 'Over 100 cm — playground toys, large play sets',
}

export default function SizeGuidePage() {
  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Size Guide</span>
      </nav>

      <h1 className="font-display text-3xl font-bold mb-2">Toy Size Guide</h1>
      <p className="text-gray-600 mb-8">Find the right toy size for your child's age and development stage.</p>

      {/* Age-based guide */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">By Age Group</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-left text-sm">
                <th className="p-3 font-semibold">Age</th>
                <th className="p-3 font-semibold">Avg Weight</th>
                <th className="p-3 font-semibold">Avg Height</th>
                <th className="p-3 font-semibold">Recommended Toys</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AGE_SIZES.map((row) => (
                <tr key={row.age} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{row.age}</td>
                  <td className="p-3 text-gray-600">{row.weight}</td>
                  <td className="p-3 text-gray-600">{row.height}</td>
                  <td className="p-3 text-gray-600 text-sm">{row.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toy size categories */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">By Toy Size</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(TOY_SIZES).map(([size, desc]) => (
            <div key={size} className="card-toy p-4">
              <h3 className="font-semibold text-sm">{size}</h3>
              <p className="mt-1 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety tips */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Safety Tips</h2>
        <div className="card-toy p-6 space-y-3 text-sm text-gray-700">
          <p>Always check the recommended age range on the product packaging.</p>
          <p>For children under 3, avoid toys with small parts that could be choking hazards.</p>
          <p>Ensure ride-on toys have appropriate weight limits for your child.</p>
          <p>Supervise play with electronic toys and check battery compartments are secure.</p>
          <p>When in doubt, size up — older children can enjoy younger toys, but not vice versa.</p>
        </div>
      </section>

      <div className="text-center">
        <Link to="/shop" className="btn-primary inline-block">Browse All Toys</Link>
      </div>
    </div>
  )
}
