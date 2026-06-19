import { useNavigate } from 'react-router-dom'

function BookingDetails() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        Booking Details 🚕
      </h1>

      <div className="mx-auto max-w-2xl rounded-3xl bg-zinc-900 p-8">

        <div className="space-y-4">

          <div>
            <p className="text-gray-400">Pickup</p>
            <p className="text-xl">Ameerpet</p>
          </div>

          <div>
            <p className="text-gray-400">Destination</p>
            <p className="text-xl">Airport</p>
          </div>

          <div>
            <p className="text-gray-400">Cab Type</p>
            <p className="text-xl text-yellow-400">
              Mini
            </p>
          </div>

          <div>
            <p className="text-gray-400">Fare</p>
            <p className="text-xl text-green-400">
              ₹120
            </p>
          </div>

          <div>
            <p className="text-gray-400">Estimated Arrival</p>
            <p className="text-xl">
              5 Minutes
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate('/booking-success')}
          className="mt-8 w-full rounded-2xl bg-yellow-400 py-3 font-bold text-black hover:bg-yellow-300"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  )
}

export default BookingDetails