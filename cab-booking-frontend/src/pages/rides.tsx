import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type Ride = {
  id: number
  pickup_location: string
  dropoff_location: string
  ride_date: string
  status: string
  fare_amount: number
}

function RideHistoryPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Ride[]>('/bookings/history')
      .then((response) => {
        console.log('BOOKINGS HISTORY:', response.data)
        setRides(response.data)
      })
      .catch((error) => {
        console.error('BOOKING HISTORY ERROR:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredRides = rides.filter((ride) => {
    const rideId = `CB${String(ride.id).padStart(3, '0')}`

    const matchesSearch = rideId
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      ride.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-400">
          My Rides 🚕
        </h1>

        <p className="mt-2 text-gray-400">
          View all your completed, scheduled and cancelled rides.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Total Rides
          </h2>

          <p className="text-3xl font-bold text-yellow-400">
            {rides.length}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Completed
          </h2>

          <p className="text-3xl font-bold text-green-400">
            {
              rides.filter(
                (ride) =>
                  ride.status.toLowerCase() === 'completed'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="text-gray-400">
            Cancelled
          </h2>

          <p className="text-3xl font-bold text-red-400">
            {
              rides.filter(
                (ride) =>
                  ride.status.toLowerCase() === 'cancelled'
              ).length
            }
          </p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Ride ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter('All')}
          className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
        >
          All
        </button>

        <button
          onClick={() => setStatusFilter('Completed')}
          className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white"
        >
          Completed
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          Pending
        </button>

        <button
          onClick={() => setStatusFilter('Cancelled')}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white"
        >
          Cancelled
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Ride History
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">
            Loading rides...
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700 text-left text-yellow-400">
                <th className="pb-4">Ride ID</th>
                <th className="pb-4">Pickup</th>
                <th className="pb-4">Destination</th>
                <th className="pb-4">Date & Time</th>
                <th className="pb-4">Fare</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRides.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-400"
                  >
                    No rides found.
                  </td>
                </tr>
              ) : (
                filteredRides.map((ride) => (
                  <tr
                    key={ride.id}
                    className="border-b border-zinc-800"
                  >
                    <td className="py-4">
                      CB{String(ride.id).padStart(3, '0')}
                    </td>

                    <td>{ride.pickup_location}</td>

                    <td>{ride.dropoff_location}</td>

                    <td>
                      {new Date(
                        ride.ride_date
                      ).toLocaleString()}
                    </td>

                    <td>₹{ride.fare_amount}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          ride.status.toLowerCase() ===
                          'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : ride.status.toLowerCase() ===
                              'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RideHistoryPage