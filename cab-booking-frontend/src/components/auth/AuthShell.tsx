import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type AuthShellProps = {
  badge: string
  title: string
  subtitle: string
  children: ReactNode
}

function AuthShell({ badge, title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative hidden overflow-hidden border-r border-yellow-400/10 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_35%),linear-gradient(180deg,#111111,#060606)] px-8 py-10 lg:flex lg:flex-col lg:justify-between lg:px-12"
        >
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-2xl font-black text-yellow-400">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-400 text-black shadow-lg shadow-yellow-400/20">
                🚕
              </span>
              CabGo
            </Link>
            <div className="mt-20 max-w-md space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300">Secure access</p>
              <h2 className="text-4xl font-black leading-tight xl:text-5xl">
                Ride booking, account access, and recovery in one polished flow.
              </h2>
              <p className="text-base leading-8 text-gray-300">
                CabGo keeps the experience fast, mobile-friendly, and visually consistent with a bold black and yellow theme.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm xl:grid-cols-3">
            {[
              ['Secure', 'Encrypted sessions'],
              ['Fast', 'Quick sign in flow'],
              ['Simple', 'One brand, every screen'],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl bg-black/30 p-4">
                <p className="text-xl font-black text-yellow-400">{value}</p>
                <p className="mt-1 text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12"
        >
          <div className="w-full max-w-lg">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link to="/" className="text-2xl font-black text-yellow-400">
                CabGo
              </Link>
              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                {badge}
              </span>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              <span className="hidden rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300 lg:inline-flex">
                {badge}
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}

export default AuthShell