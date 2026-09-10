import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Baby, Blocks, Puzzle, Rocket, Gamepad2, Star } from 'lucide-react'

const AGE_GROUPS = [
  { label: '0–12 Months', value: '0-1', icon: Baby, color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { label: '1–3 Years', value: '1-3', icon: Blocks, color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: '3–6 Years', value: '3-6', icon: Puzzle, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: '6–9 Years', value: '6-9', icon: Rocket, color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { label: '9–12 Years', value: '9-12', icon: Star, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: '12+ Years', value: '12-99', icon: Gamepad2, color: 'bg-red-50 border-red-200 text-red-700' },
]

const OCCASIONS = [
  'Birthday', 'Eid', 'Christmas', 'Back to School', 'Reward/Present', 'Just Because',
]

const INTERESTS = [
  'STEM & Learning', 'Arts & Crafts', 'Outdoor Play', 'Building & Construction',
  'Dolls & Pretend Play', 'Vehicles & Racing', 'Puzzles & Board Games', 'Electronic & Remote Control',
]

const BUDGET_RANGES = [
  { label: 'Under Rs. 1,000', min: 0, max: 1000 },
  { label: 'Rs. 1,000 – Rs. 3,000', min: 1000, max: 3000 },
  { label: 'Rs. 3,000 – Rs. 5,000', min: 3000, max: 5000 },
  { label: 'Rs. 5,000 – Rs. 10,000', min: 5000, max: 10000 },
  { label: 'Rs. 10,000+', min: 10000, max: 999999 },
]

export default function GiftFinderPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [age, setAge] = useState('')
  const [occasion, setOccasion] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [budget, setBudget] = useState<{ min: number; max: number } | null>(null)

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const buildSearchUrl = () => {
    const params = new URLSearchParams()
    if (age) {
      const [min, max] = age.split('-')
      params.set('ageMin', min)
      params.set('ageMax', max)
    }
    if (budget) {
      params.set('minPrice', String(budget.min))
      params.set('maxPrice', String(budget.max))
    }
    if (interests.length > 0) {
      params.set('search', interests[0])
    }
    return `/shop?${params.toString()}`
  }

  const onFinish = () => {
    navigate(buildSearchUrl())
  }

  return (
    <div className="container-toy py-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-5xl">🎁</span>
        <h1 className="mt-3 font-display text-3xl font-bold">Gift Finder</h1>
        <p className="mt-2 text-gray-600">Answer a few questions and we'll find the perfect toy.</p>
      </div>

      {/* Progress */}
      <div className="mx-auto mt-8 max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s < 4 && <div className={`ml-2 h-0.5 w-12 sm:w-20 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Age */}
        {step === 1 && (
          <div className="card-toy p-6">
            <h2 className="mb-4 text-lg font-semibold">Who is the toy for?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag.value}
                  onClick={() => setAge(ag.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${age === ag.value ? `${ag.color} border-current scale-105 shadow-md` : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <ag.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{ag.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!age} className="btn-primary mt-6 w-full disabled:opacity-50">
              Next <ArrowRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Occasion */}
        {step === 2 && (
          <div className="card-toy p-6">
            <h2 className="mb-4 text-lg font-semibold">What's the occasion?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setOccasion(occ)}
                  className={`rounded-xl border-2 p-4 text-sm font-medium transition-all ${occasion === occ ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} disabled={!occasion} className="btn-primary flex-1 disabled:opacity-50">
                Next <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="card-toy p-6">
            <h2 className="mb-4 text-lg font-semibold">What are they interested in?</h2>
            <p className="mb-3 text-sm text-gray-500">Select one or more</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${interests.includes(interest) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">
                Next <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div className="card-toy p-6">
            <h2 className="mb-4 text-lg font-semibold">What's your budget?</h2>
            <div className="space-y-2">
              {BUDGET_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setBudget({ min: range.min, max: range.max })}
                  className={`w-full rounded-xl border-2 p-4 text-left text-sm font-medium transition-all ${budget?.max === range.max ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50">Back</button>
              <button onClick={onFinish} className="btn-primary flex-1">
                <Sparkles className="mr-1 inline h-4 w-4" /> Find Gifts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
