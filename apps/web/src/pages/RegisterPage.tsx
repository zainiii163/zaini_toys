import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, Lock, User, Shield } from 'lucide-react'
import { useRegisterMutation, useSendOtpMutation, useVerifyOtpMutation } from '../app/services/auth'
import { useAppDispatch } from '../hooks/typed'
import { setUser } from '../store/authSlice'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/account'
  const dispatch = useAppDispatch()

  const [mode, setMode] = useState<'email' | 'phone'>('email')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    referralCode: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  const [register] = useRegisterMutation()
  const [sendOtp] = useSendOtpMutation()
  const [verifyOtp] = useVerifyOtpMutation()

  const validate = () => {
    if (!form.name.trim()) return 'Name is required'
    if (mode === 'email' && !form.email) return 'Email is required'
    if (mode === 'phone' && !form.phone) return 'Phone is required'
    if (!form.password) return 'Password is required'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain an uppercase letter'
    if (!/[0-9]/.test(form.password)) return 'Password must contain a number'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    if (mode === 'phone' && otpSent && form.otp.length !== 6) return 'Enter 6-digit OTP'
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)
    setError('')

    try {
      if (mode === 'email') {
        const res = await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          referralCode: form.referralCode || undefined,
        }).unwrap()
        dispatch(setUser(res.data.user))
        navigate(from, { replace: true })
      } else if (otpSent) {
        await verifyOtp({ phone: form.phone, otp: form.otp, purpose: 'verification' }).unwrap()
        // After OTP verification, register with phone
        const res = await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          referralCode: form.referralCode || undefined,
        }).unwrap()
        dispatch(setUser(res.data.user))
        navigate(from, { replace: true })
      } else {
        await sendOtp({ phone: form.phone, purpose: 'verification' }).unwrap()
        setOtpSent(true)
      }
    } catch (err: any) {
      setError(err?.data?.error || 'Registration failed')
    }
  }

  const onSendOtp = async () => {
    if (!form.phone) return setError('Enter phone number')
    setError('')
    try {
      await sendOtp({ phone: form.phone, purpose: 'verification' }).unwrap()
      setOtpSent(true)
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to send OTP')
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
          <h1 className="font-display text-2xl font-semibold">Create an account</h1>
          <p className="mt-1 text-gray-500">Join thousands of happy parents</p>
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label-toy">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-toy pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {mode === 'email' && (
            <div>
              <label className="label-toy">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-toy pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="label-toy">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-toy pl-10"
                placeholder="03XX-XXXXXXX"
                required
              />
            </div>
            {otpSent && mode === 'phone' && (
              <button type="button" onClick={onSendOtp} className="mt-2 text-sm text-blue-600 hover:underline">
                Resend OTP
              </button>
            )}
          </div>

          {otpSent && mode === 'phone' && (
            <div>
              <label className="label-toy">OTP Code</label>
              <div className="flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={form.otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (/^\d?$/.test(val)) setForm({ ...form, otp: form.otp.slice(0, i) + val + form.otp.slice(i + 1) })
                    }}
                    className="input-toy w-12 text-center text-2xl"
                  />
                ))}
              </div>
            </div>
          )}

          {!otpSent && mode === 'phone' && (
            <button type="button" onClick={onSendOtp} className="btn-secondary w-full">
              Send OTP to Register
            </button>
          )}

          <div>
            <label className="label-toy">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-toy pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label-toy">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input-toy pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="label-toy">Referral Code (Optional)</label>
            <input
              type="text"
              value={form.referralCode}
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
              className="input-toy"
              placeholder="TOYXXXX"
            />
          </div>

          <button type="submit" disabled={otpSent && mode === 'phone' && form.otp.length !== 6} className="btn-primary w-full">
            {otpSent && mode === 'phone' ? 'Verify & Create Account' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">
          By creating an account, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}