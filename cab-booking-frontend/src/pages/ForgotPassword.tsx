import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import AuthShell from '@/components/auth/AuthShell'

type ForgotPasswordErrors = {
  email?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<ForgotPasswordErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors: ForgotPasswordErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    return nextErrors
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      navigate('/verify-otp')
    }, 1000)
  }

  return (
    <AuthShell
      badge="Password recovery"
      title="Forgot your password?"
      subtitle="Enter your registered email and we&apos;ll send a one-time code to continue."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200" htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`h-12 w-full rounded-2xl border bg-black px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:ring-2 ${
              errors.email ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:border-yellow-400 focus:ring-yellow-400/30'
            }`}
            placeholder="Enter your registered email"
          />
          {errors.email ? <p className="text-sm text-red-400">{errors.email}</p> : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-yellow-400 px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <p className="pt-2 text-center text-sm text-gray-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-yellow-300 transition hover:text-yellow-200">
            Login here
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  )
}

export default ForgotPassword