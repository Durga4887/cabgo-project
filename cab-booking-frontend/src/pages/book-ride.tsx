import { useState } from 'react'

import { CalendarDays, Clock3, MapPinned, Navigation2 } from 'lucide-react'

import { createBooking, extractApiErrorMessage } from '@/lib/api'

const steps = [
  'Choose pickup and drop locations',
  'Pick a ride type and confirm fare',
  'Track the assigned cab in real time',
]

export function BookRidePage() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const buildRideDate = () => {
    if (!scheduleDate) {
      return ''
    }

    const timePart = scheduleTime || '00:00'
    return new Date(`${scheduleDate}T${timePart}:00`).toISOString()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await createBooking({
        pickup_location: pickupLocation,
        dropoff_location: destination,
        ride_date: buildRideDate(),
        notes: notes || null,
      })

      setMessage('Booking created successfully.')
    } catch (requestError) {
      setMessage(extractApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <span className="text-sm font-medium text-primary">Book a ride</span>
        <h1 className="text-3xl font-semibold tracking-tight">Plan a trip in a few quick steps.</h1>
        <p className="text-muted-foreground">
          Connect your trip details to the backend and create a live booking instantly.
        </p>

        <div className="space-y-3 pt-2">
          {steps.map((step, index) => (
            <div key={step} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Pickup location
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-muted-foreground">
              <MapPinned className="h-4 w-4" />
              <input
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                placeholder="Enter pickup point"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Destination
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-muted-foreground">
              <Navigation2 className="h-4 w-4" />
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Enter destination"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Schedule
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <input
                type="date"
                value={scheduleDate}
                onChange={(event) => setScheduleDate(event.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Time
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              <input
                type="time"
                value={scheduleTime}
                onChange={(event) => setScheduleTime(event.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 grid gap-2 text-sm font-medium">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Any special instructions?"
            className="rounded-xl border border-input bg-background px-4 py-3 outline-none"
          />
        </label>

        <div className="mt-6 rounded-2xl bg-muted/60 p-5">
          <p className="text-sm text-muted-foreground">Estimated fare</p>
          <p className="mt-2 text-3xl font-semibold">₹150</p>
        </div>

        {message ? <p className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Confirming ride...' : 'Confirm ride'}
        </button>
      </form>
    </section>
  )
}