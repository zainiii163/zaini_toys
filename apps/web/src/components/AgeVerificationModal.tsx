import { useState } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function AgeVerificationModal({ open, onAccept, onDecline }: Props) {
  const [age, setAge] = useState('')

  if (!open) return null

  const onVerify = () => {
    const a = Number(age)
    if (!age || a < 18) {
      toast.error('You must be at least 18 years old to view this product')
      return
    }
    onAccept()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">Age Verification</h2>
          <p className="mt-2 text-sm text-gray-500">
            This product is intended for adults. You must be 18 or older to proceed.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Enter your age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="120"
              placeholder="18+"
              className="input-toy w-full text-center text-xl"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onVerify}
              disabled={!age || Number(age) < 18}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Verify
            </button>
            <button
              onClick={onDecline}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Decline
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            <AlertTriangle className="mr-1 inline h-3 w-3" />By clicking Verify, you confirm you're 18 or older.
          </p>
        </div>
      </div>
    </div>
  )
}
