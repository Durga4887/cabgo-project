import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createBooking, extractApiErrorMessage } from '@/lib/api'

function BookingForm() {
  const navigate = useNavigate()

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [selectedCab, setSelectedCab] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [cabs, setCabs] = useState<
    { type: string; fare: number; eta: string }[]
  >([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!pickup || !destination) {
      alert('Please enter pickup and destination')
      return
    }

    setCabs([
      {
        type: 'Mini',
        fare: 120,
        eta: '5 min',
      },
      {
        type: 'Sedan',
        fare: 180,
        eta: '4 min',
      },
      {
        type: 'SUV',
        fare: 250,
        eta: '6 min',
      },
    ])
  }

  const buildRideDate = () => {
    if (!date) {
      return ''
    }

    const timePart = time || '00:00'
    return new Date(`${date}T${timePart}:00`).toISOString()
  }

  const handleBookCab = async (cabType: string) => {
    setSelectedCab(cabType)
    setError('')

    if (!pickup || !destination || !date) {
      setError('Please enter pickup, destination, and date before booking.')
      return
    }

    setLoading(true)

    try {
      await createBooking({
        pickup_location: pickup,
        dropoff_location: destination,
        ride_date: buildRideDate(),
        notes: `Cab type: ${cabType}${time ? ` | Preferred time: ${time}` : ''}`,
      })

      navigate('/booking-success')
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-yellow-400/20 bg-[#121212] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">
            Quick booking
          </p>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Find a cab in seconds
          </h2>

          <p className="max-w-2xl text-gray-400">
            Enter your trip details below and search available cabs.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="grid gap-4 lg:grid-cols-5"
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-200">
              Pickup Location
            </span>

            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-200">
              Destination
            </span>

            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-200">
              Date
            </span>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-200">
              Time
            </span>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-black px-4 text-white"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-yellow-400 font-bold text-black transition hover:bg-yellow-300"
            >
              Search Cab
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {cabs.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cabs.map((cab, index) => (
              <div
                key={index}
                className="rounded-2xl border border-yellow-400/20 bg-black p-5"
              >
                <h3 className="text-xl font-bold text-yellow-400">
                  {cab.type}
                </h3>

                <p className="mt-2 text-white">
                  Fare: ₹{cab.fare}
                </p>

                <p className="text-gray-400">
                  ETA: {cab.eta}
                </p>

                <button
                  onClick={() => handleBookCab(cab.type)}
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-yellow-400 py-2 font-bold text-black transition hover:bg-yellow-300"
                >
                  {loading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedCab && (
          <div className="mt-6 rounded-2xl border border-green-500 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-green-400">
              🚕 {selectedCab} selected successfully!
            </p>

            <p className="text-sm text-gray-300">
              Redirecting to booking details...
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BookingForm