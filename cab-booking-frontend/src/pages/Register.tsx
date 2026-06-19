import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import AuthShell from '@/components/auth/AuthShell'
import { extractApiErrorMessage, registerUser } from '@/lib/api'

type RegisterErrors = {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9+\-()\s]{7,}$/

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const nextErrors: RegisterErrors = {}

    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    } else if (fullName.trim().length < 3) {
      nextErrors.fullName = 'Full name must be at least 3 characters.'
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!phonePattern.test(phone)) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phone.trim() || null,
        password,
      })
      navigate('/login')
    } catch (requestError) {
      setSubmitError(extractApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      badge="Create your account"
      title="Start riding with CabGo"
      subtitle="Create your account and unlock faster booking, saved locations, and trip tracking."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="grid gap-4"
      >
        {[
          {
            id: 'register-fullname',
            label: 'Full Name',
            value: fullName,
            setter: setFullName,
            placeholder: 'Enter your full name',
            error: errors.fullName,
            type: 'text',
          },
          {
            id: 'register-email',
            label: 'Email',
            value: email,
            setter: setEmail,
            placeholder: 'Enter your email',
            error: errors.email,
            type: 'email',
          },
          {
            id: 'register-phone',
            label: 'Phone Number',
            value: phone,
            setter: setPhone,
            placeholder: 'Enter your phone number',
            error: errors.phone,
            type: 'tel',
          },
          {
            id: 'register-password',
            label: 'Password',
            value: password,
            setter: setPassword,
            placeholder: 'Create a password',
            error: errors.password,
            type: 'password',
          },
          {
            id: 'register-confirm-password',
            label: 'Confirm Password',
            value: confirmPassword,
            setter: setConfirmPassword,
            placeholder: 'Confirm your password',
            error: errors.confirmPassword,
            type: 'password',
          },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-200" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(event) => field.setter(event.target.value)}
              className={`h-12 w-full rounded-2xl border bg-black px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:ring-2 ${
                field.error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : 'border-white/10 focus:border-yellow-400 focus:ring-yellow-400/30'
              }`}
              placeholder={field.placeholder}
            />
            {field.error ? <p className="text-sm text-red-400">{field.error}</p> : null}
          </div>
        ))}

        {submitError ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-yellow-400 px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="pt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-yellow-300 transition hover:text-yellow-200">
            Login here
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  )
}

export default Register