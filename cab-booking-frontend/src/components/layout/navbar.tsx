import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

        <NavLink
          to="/"
          className="text-2xl font-bold text-yellow-400"
        >
          🚕 CabGo
        </NavLink>

        <nav className="flex items-center gap-4">

          <NavLink
            to="/"
            className="text-white hover:text-yellow-400"
          >
            Home
          </NavLink>

          <NavLink
            to="/book"
            className="text-white hover:text-yellow-400"
          >
            Book Ride
          </NavLink>

          <NavLink
            to="/rides"
            className="text-white hover:text-yellow-400"
          >
            My Rides
          </NavLink>

          <NavLink
            to="/profile"
            className="text-white hover:text-yellow-400"
          >
            Profile
          </NavLink>

          <NavLink
            to="/wallet"
            className="text-white hover:text-yellow-400"
          >
            Wallet
          </NavLink>

          <NavLink
            to="/support"
            className="text-white hover:text-yellow-400"
          >
            Support
          </NavLink>

        </nav>
      </div>
    </header>
  )
}