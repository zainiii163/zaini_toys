import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

const STORES = [
  {
    name: 'Toy Shop - Clifton',
    address: 'Block 5, Clifton, Karachi',
    phone: '+92 300 1234567',
    hours: 'Mon-Sat: 10AM - 10PM, Sun: 12PM - 8PM',
    coordinates: { lat: 24.8109, lng: 67.0305 },
    features: ['Parking', 'Play Area', 'Gift Wrapping'],
  },
  {
    name: 'Toy Shop - Defence',
    address: 'DHA Phase 5, Defence, Karachi',
    phone: '+92 300 1234568',
    hours: 'Mon-Sat: 10AM - 10PM, Sun: 12PM - 8PM',
    coordinates: { lat: 24.8036, lng: 67.0553 },
    features: ['Parking', 'Birthday Parties', 'Workshop Area'],
  },
  {
    name: 'Toy Shop - Lahore',
    address: 'Gulberg III, Lahore',
    phone: '+92 300 1234569',
    hours: 'Mon-Sat: 10AM - 9PM, Sun: 12PM - 8PM',
    coordinates: { lat: 31.5142, lng: 74.3496 },
    features: ['Parking', 'Play Area', 'Café'],
  },
  {
    name: 'Toy Shop - Islamabad',
    address: 'F-7 Markaz, Islamabad',
    phone: '+92 300 1234570',
    hours: 'Mon-Sat: 10AM - 9PM, Sun: Closed',
    coordinates: { lat: 33.7032, lng: 73.0364 },
    features: ['Parking', 'Gift Wrapping', 'Online Order Pickup'],
  },
]

export default function StoreLocationsPage() {
  return (
    <div className="container-toy py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Store Locations</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Our Stores</h1>
        <p className="mt-2 text-gray-600">Visit us in person! Our friendly staff will help you find the perfect toy.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {STORES.map((store) => (
          <div key={store.name} className="card-toy overflow-hidden">
            {/* Map placeholder */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-blue-600" />
                <p className="mt-2 text-sm font-medium text-blue-800">{store.name}</p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${store.coordinates.lat},${store.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm hover:bg-blue-50"
              >
                <Navigation className="h-3 w-3" /> Directions
              </a>
            </div>

            <div className="p-4">
              <h2 className="font-semibold">{store.name}</h2>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <a href={`tel:${store.phone}`} className="hover:text-blue-600">{store.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>{store.hours}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {store.features.map((f) => (
                  <span key={f} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 card-toy bg-gradient-to-r from-blue-600 to-teal-500 p-8 text-center text-white">
        <h2 className="font-display text-2xl font-bold">Can't Visit in Person?</h2>
        <p className="mt-2 text-blue-100">Shop online with free delivery on orders over Rs. 3,000!</p>
        <Link to="/shop" className="btn-primary mt-4 inline-block bg-white !text-blue-700 hover:bg-gray-100">Shop Now</Link>
      </div>
    </div>
  )
}
