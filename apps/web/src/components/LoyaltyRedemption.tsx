import { useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector } from '../hooks/typed'

interface Props {
  subtotal: number
  onApply: (points: number, discount: number) => void
  applied: boolean
  onRemove: () => void
}

const POINTS_PER_RS = 100 // 1 point per Rs. 100 spent
const REDEMPTION_RATE = 0.5 // 1 point = Rs. 0.50 discount

export default function LoyaltyRedemption({ subtotal, onApply, applied, onRemove }: Props) {
  const auth = useAppSelector((s) => s.auth)
  const [points, setPoints] = useState(0)

  const userPoints = auth.user?.loyaltyPoints || 0
  const maxRedeemable = Math.min(userPoints, Math.floor(subtotal / POINTS_PER_RS) * POINTS_PER_RS)
  const discount = Math.floor(points * REDEMPTION_RATE)
  const canApply = points > 0 && points <= maxRedeemable

  if (!auth.isAuthenticated || userPoints === 0) return null

  const onApplyPoints = () => {
    if (!canApply) {
      toast.error(`You can redeem up to ${maxRedeemable} points`)
      return
    }
    onApply(points, discount)
    toast.success(`${points} points applied! You save Rs. ${discount}`)
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-sm text-amber-800">Loyalty Points</h3>
      </div>

      {applied ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 font-medium">{points} points applied</p>
            <p className="text-xs text-green-600">You save Rs. {discount}</p>
          </div>
          <button onClick={onRemove} className="text-xs text-red-600 hover:underline">Remove</button>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-amber-700">
            You have <span className="font-bold">{userPoints}</span> points (1 point = Rs. {REDEMPTION_RATE})
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={points || ''}
                onChange={(e) => setPoints(Number(e.target.value))}
                max={maxRedeemable}
                min={0}
                className="w-full rounded-lg border border-amber-300 bg-white py-1.5 px-3 text-sm"
                placeholder="Points to use"
              />
            </div>
            <button onClick={onApplyPoints} disabled={!canApply} className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
              Apply
            </button>
          </div>
          <button onClick={() => { setPoints(maxRedeemable) }} className="mt-1.5 text-xs text-amber-700 hover:underline">
            Use max ({maxRedeemable} pts = Rs. {Math.floor(maxRedeemable * REDEMPTION_RATE)} off)
          </button>
        </>
      )}
    </div>
  )
}
