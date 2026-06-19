import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import AuthShell from '@/components/auth/AuthShell'
import { extractApiErrorMessage, loginUser, setAuthToken } from '@/lib/api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await loginUser({
        email,
        password,
      })

      setAuthToken(response.access_token)

      navigate('/dashboard')
    } catch (requestError) {
      console.error('LOGIN ERROR:', requestError)

      setError(
        extractApiErrorMessage(requestError) ||
          'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to CabGo"
      subtitle="Access your bookings, wallet, profile, and trip history from one secure place."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="grid gap-4"
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium text-gray-200">
            Email
          </span>

          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            placeholder="Enter your email"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-gray-200">
            Password
          </span>

          <input
            type="password"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            placeholder="Enter your password"
          />
        </label>

        {error && (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-yellow-400 px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-center text-sm">
          <Link
            to="/forgot-password"
            className="font-semibold text-yellow-300 hover:text-yellow-200"
          >
            Forgot Password?
          </Link>
        </p>

        <p className="pt-2 text-center text-sm text-gray-400">
          No account yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-yellow-300 transition hover:text-yellow-200"
          >
            Register here
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  )
}

export default Login