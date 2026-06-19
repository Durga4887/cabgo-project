import { useNavigate } from 'react-router-dom'

function BookingSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-yellow-400/20 bg-[#121212] p-8 text-center">
        <div className="text-6xl mb-4">🚕</div>

        <h1 className="text-3xl font-bold text-yellow-400">
          Booking Successful
        </h1>

        <p className="mt-4 text-gray-300">
          Your cab has been booked successfully.
        </p>

        <div className="mt-6 rounded-2xl bg-black p-4">
          <p className="text-white">
            Cab Type: <span className="text-yellow-400">Mini</span>
          </p>

          <p className="text-white mt-2">
            Fare: <span className="text-yellow-400">₹120</span>
          </p>

          <p className="text-white mt-2">
            ETA: <span className="text-yellow-400">5 min</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full rounded-2xl bg-yellow-400 py-3 font-bold text-black hover:bg-yellow-300"
        >
          Go To Dashboard
        </button>
      </div>
    </div>
  )
}

export default BookingSuccess