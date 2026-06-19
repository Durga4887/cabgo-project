import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-yellow-400/20 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2 text-xl font-black tracking-tight text-yellow-400">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-400 text-lg text-black shadow-lg shadow-yellow-400/20">
            🚕
          </span>
          <span>CabGo</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 transition hover:text-yellow-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-yellow-400/40 px-5 py-2 text-sm font-semibold text-yellow-400 transition hover:-translate-y-0.5 hover:border-yellow-400 hover:bg-yellow-400/10"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-yellow-400/30 text-yellow-400 transition hover:bg-yellow-400/10 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-yellow-400/10 bg-black px-4 pb-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-yellow-400"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-yellow-400/40 px-5 py-3 text-center text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-yellow-400 px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar