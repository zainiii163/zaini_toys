import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, KeyRound } from 'lucide-react'
import { useForgotPasswordMutation, useResetPasswordMutation } from '../app/services/auth'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isReset = !!searchParams.get('token') || !!searchParams.get('resetToken')

  const [step] = useState<'request' | 'reset'>(isReset ? 'reset' : 'request')
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({ token: searchParams.get('token') || searchParams.get('resetToken') || '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [forgotPassword] = useForgotPasswordMutation()
  const [resetPassword] = useResetPasswordMutation()

  const onRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return setError('Enter your email address')
    setError('')
    try {
      await forgotPassword({ email }).unwrap()
      setSuccess('A password reset link has been sent to your email.')
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to send reset link')
    }
  }

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.token) return setError('Reset token is required')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setError('')
    try {
      await resetPassword({ token: form.token, password: form.password }).unwrap()
      setSuccess('Password reset successfully. You can now sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to reset password')
    }
  }

  return (
    <div className="container-toy py-12 max-w-md mx-auto">
      <div className="card-toy p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            {step === 'request' ? <Lock className="h-8 w-8 text-blue-600" /> : <KeyRound className="h-8 w-8 text-blue-600" />}
          </div>
          <h1 className="font-display text-2xl font-semibold">
            {step === 'request' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="mt-1 text-gray-500">
            {step === 'request' ? 'Enter your email to receive a reset link' : 'Enter your new password'}
          </p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        {step === 'request' ? (
          <form onSubmit={onRequest} className="space-y-4">
            <div>
              <label className="label-toy">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-toy pl-10 w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Send Reset Link</button>
          </form>
        ) : (
          <form onSubmit={onReset} className="space-y-4">
            <div>
              <label className="label-toy">New Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-toy w-full"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="label-toy">Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input-toy w-full"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">Reset Password</button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered it? <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  )
}