import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api, clearToken } from '@/lib/api'

type DashboardData = {
  total_bookings: number
  total_rides: number
  completed_rides: number
  active_bookings: number
  cancelled_rides: number
  total_spent: number
  wallet_balance: number
  currency: string
  recent_bookings: Array<{
    id: number
    pickup_location: string
    dropoff_location: string
    ride_date: string
    status: string
    fare_amount: number
  }>
}

function Dashboard() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get<DashboardData>('/dashboard').then((response) => setDashboard(response.data)).catch(() => navigate('/login'))
  }, [navigate])

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  const currency = dashboard?.currency ?? '₹'

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
        <h1 className="text-5xl font-bold text-yellow-400">Dashboard 🚕</h1>

        <div className="flex gap-4">
          <Link to="/rides" className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300">
            My Rides
          </Link>
          <Link to="/profile" className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300">
            Profile
          </Link>
          <button type="button" onClick={handleLogout} className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold text-yellow-400">Welcome back 👋</h2>
        <p className="mt-2 text-gray-400">
          {dashboard ? 'Ready for your next ride? Book a cab and travel safely.' : 'Loading your dashboard...'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">Total Rides</h2>
          <p className="text-3xl font-bold text-yellow-400">{dashboard?.total_rides ?? 0}</p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-400">{dashboard ? `${currency} ${dashboard.wallet_balance}` : '₹0'}</p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">Total Bookings</h2>
          <p className="text-3xl font-bold text-blue-400">{dashboard?.total_bookings ?? 0}</p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">Total Spent</h2>
          <p className="text-3xl font-bold text-purple-400">{dashboard ? `${currency} ${dashboard.total_spent}` : '₹0'}</p>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-6 text-2xl font-bold">Upcoming Ride</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {dashboard?.recent_bookings?.[0] ? (
            <>
              <div>
                <p className="text-gray-400">Pickup</p>
                <p className="font-semibold">{dashboard.recent_bookings[0].pickup_location}</p>
              </div>
              <div>
                <p className="text-gray-400">Destination</p>
                <p className="font-semibold">{dashboard.recent_bookings[0].dropoff_location}</p>
              </div>
              <div>
                <p className="text-gray-400">Fare</p>
                  <p className="font-semibold text-yellow-400">{currency} {dashboard.recent_bookings[0].fare_amount}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="font-semibold text-green-400">{dashboard.recent_bookings[0].status}</p>
              </div>
            </>
          ) : (
            <div className="md:col-span-4 text-gray-400">No recent bookings found.</div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link to="/" className="rounded-xl bg-yellow-400 p-4 text-center font-bold text-black hover:bg-yellow-300">🚕 Book New Ride</Link>
        <Link to="/rides" className="rounded-xl bg-blue-500 p-4 text-center font-bold text-white hover:bg-blue-400">📜 Ride History</Link>
        <Link to="/profile" className="rounded-xl bg-green-500 p-4 text-center font-bold text-white hover:bg-green-400">👤 View Profile</Link>
      </div>

      <div className="mt-10 rounded-xl bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <p className="mt-4 text-5xl font-bold text-green-400">{dashboard ? `${dashboard.currency} ${dashboard.wallet_balance}` : '₹0'}</p>
      </div>

      <div className="mt-10 rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-6 text-2xl font-bold">Recent Rides</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-yellow-400">
              <th>Ride ID</th>
              <th>Date</th>
              <th>Pickup</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(dashboard?.recent_bookings ?? []).map((booking) => (
              <tr key={booking.id}>
                <td>CB{String(booking.id).padStart(3, '0')}</td>
                <td>{new Date(booking.ride_date).toLocaleDateString()}</td>
                <td>{booking.pickup_location}</td>
                <td>{currency} {booking.fare_amount}</td>
                <td className={booking.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard