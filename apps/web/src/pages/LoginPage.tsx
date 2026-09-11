import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react'
import { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation } from '../app/services/auth'
import { useAppDispatch } from '../hooks/typed'
import { setUser } from '../store/authSlice'
import type { User } from '../lib/types'

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
      const res = await verifyOtp({ phone, otp, purpose: 'login' }).unwrap()
      const data = res.data as { user: User }
      dispatch(setUser(data.user))
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

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400">Or continue with</span></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" disabled className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" disabled className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}