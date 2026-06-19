import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import AuthShell from '@/components/auth/AuthShell'

function VerifyOTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) {
      return
    }

    const nextOtp = [...otp]
    nextOtp[index] = value
    setOtp(nextOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = otp.join('')

    if (value.length !== 6) {
      setError('Enter the full 6-digit OTP.')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 1000)
  }

  const handleResend = () => {
    setResendLoading(true)
    window.setTimeout(() => {
      setResendLoading(false)
      setError('A fresh OTP has been sent to your email.')
    }, 1000)
  }

  return (
    <AuthShell
      badge="Verify OTP"
      title="Enter the verification code"
      subtitle="Type the 6-digit OTP we sent to your email to continue your CabGo recovery flow."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleVerify}
        className="space-y-5"
      >
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={`otp-${index}`}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className="h-14 w-11 rounded-2xl border border-white/10 bg-black text-center text-lg font-bold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 sm:h-16 sm:w-12"
            />
          ))}
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-yellow-400 px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-yellow-400/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {resendLoading ? 'Resending...' : 'Resend OTP'}
        </button>

        <p className="pt-2 text-center text-sm text-gray-400">
          Wrong account?{' '}
          <Link to="/forgot-password" className="font-semibold text-yellow-300 transition hover:text-yellow-200">
            Try again
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  )
}

export default VerifyOTP