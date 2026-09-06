import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react'
import { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from '../app/services/auth'
import { useAppDispatch } from '../hooks/typed'
import { setUser } from '../store/authSlice'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/account'
  const dispatch = useAppDispatch()

  const [mode, setMode] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  const [login, { isLoading }] = useLoginMutation()
  const [sendOtp] = useSendOtpMutation()
  const [verifyOtp] = useVerifyOtpMutation()

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setUser(res.data.user))
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.data?.error || 'Invalid credentials')
    }
  }

  const onSendOtp = async () => {
    if (!phone) return setError('Enter phone number')
    setError('')
    try {
      await sendOtp({ phone, purpose: 'login' }).unwrap()
      setOtpSent(true)
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to send OTP')
    }
  }

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) return setError('Enter 6-digit OTP')
    setError('')
    try {
      await verifyOtp({ phone, otp, purpose: 'login' }).unwrap()
      dispatch(setUser({ _id: '', name: '', email: '', phone, role: 'customer', addresses: [], loyaltyPoints: 0, loyaltyTier: 'bronze', wishlist: [] }))
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.data?.error || 'Invalid OTP')
    }
  }

  return (
    <div className="container-toy py-12 max-w-md mx-auto">
      <div className="card-toy p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">T</span>
            <span className="font-display text-2xl font-semibold text-gray-900">Toy Shop</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-gray-500">Sign in to your account</p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => { setMode('email'); setOtpSent(false); setError('') }}
              className={`pb-3 text-sm font-medium border-b-2 ${mode === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
              Email
            </button>
            <button
              onClick={() => { setMode('phone'); setOtpSent(false); setError('') }}
              className={`pb-3 text-sm font-medium border-b-2 ${mode === 'phone' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
              Phone (OTP)
            </button>
          </nav>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {mode === 'email' ? (
          <form onSubmit={onLogin} className="space-y-4">
            <div>
              <label className="label-toy">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-toy pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-toy">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-toy pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <div>
                <label className="label-toy">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-toy pl-10"
                    placeholder="03XX-XXXXXXX"
                    required
                  />
                </div>
                <button type="button" onClick={onSendOtp} disabled={isLoading || !phone} className="btn-primary w-full mt-2">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <label className="label-toy">Enter OTP</label>
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        if (/^\d?$/.test(val)) setOtp(otp.slice(0, i) + val + otp.slice(i + 1))
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          // handle backspace
                        }
                      }}
                      className="input-toy w-12 text-center text-2xl"
                    />
                  ))}
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                  {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </form>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}