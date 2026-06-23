import { useMemo, useState } from 'react'

import { CheckCircle2, Loader2, MapPinned, Navigation2, Route, Wallet } from 'lucide-react'

import { createBooking, extractApiErrorMessage, type Booking } from '@/lib/api'
import { LocationAutocomplete } from '@/components/LocationAutocomplete'
import { calculateDistanceKm, estimateDurationMinutes, estimateFare } from '@/lib/geo'
import type { LocationValue } from '@/lib/geocode'

const steps = [
  'Choose pickup and drop locations',
  'Review the live distance and fare estimate',
  'Confirm and track the assigned cab',
]

type LocationField = {
  text: string
  location: LocationValue | null
}

const emptyField: LocationField = { text: '', location: null }

export function BookRidePage() {
  const [pickup, setPickup] = useState<LocationField>(emptyField)
  const [destination, setDestination] = useState<LocationField>(emptyField)
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [confirmedDistanceKm, setConfirmedDistanceKm] = useState<number | null>(null)

  const distanceKm = useMemo(() => {
    if (!pickup.location || !destination.location) {
      return null
    }

    return calculateDistanceKm(pickup.location, destination.location)
  }, [pickup.location, destination.location])

  const estimatedFare = distanceKm !== null ? estimateFare(distanceKm) : null
  const estimatedDuration = distanceKm !== null ? estimateDurationMinutes(distanceKm) : null
console.log('Pickup Location:', pickup.location)
console.log('Destination Location:', destination.location)
console.log('Distance KM:', distanceKm)
  const pickupText = pickup.text.trim()
  const destinationText = destination.text.trim()

  const pickupInvalid = pickupText.length > 0 && pickupText.length < 3
  const destinationInvalid = destinationText.length > 0 && destinationText.length < 3
  const sameLocation =
    pickupText.length > 0 && destinationText.length > 0 && pickupText.toLowerCase() === destinationText.toLowerCase()

  const canSubmit =
    pickupText.length >= 3 &&
    destinationText.length >= 3 &&
    pickup.location !== null &&
    destination.location !== null &&
    !sameLocation &&
    !loading

  const handlePickupChange = (text: string) => {
    setPickup((current) => ({ ...current, text }))
    setConfirmedBooking(null)
  }

  const handleDestinationChange = (text: string) => {
    setDestination((current) => ({ ...current, text }))
    setConfirmedBooking(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    if (!pickup.location || !destination.location) {
      setFormError('Please pick a valid pickup and destination from the suggestions, or use current location.')
      return
    }

    if (pickupText.toLowerCase() === destinationText.toLowerCase()) {
      setFormError('Pickup and destination cannot be the same place.')
      return
    }

    setLoading(true)

    try {
      const booking = await createBooking({
        pickup_location: pickup.text,
        dropoff_location: destination.text,
        distance_km: distanceKm ?? undefined,
        notes: notes || null,
      })

      setConfirmedBooking(booking)
      setConfirmedDistanceKm(distanceKm)
      setPickup(emptyField)
      setDestination(emptyField)
      setNotes('')
    } catch (requestError) {
      setFormError(extractApiErrorMessage(requestError))
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
          Search for your pickup and destination, see the live fare estimate, and confirm instantly — no
          scheduling required.
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

        {confirmedBooking ? (
          <div className="space-y-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">Booking confirmed</p>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Booking ID</dt>
                <dd className="font-medium">CB{String(confirmedBooking.id).padStart(3, '0')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Pickup</dt>
                <dd className="text-right font-medium">{confirmedBooking.pickup_location}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Destination</dt>
                <dd className="text-right font-medium">{confirmedBooking.dropoff_location}</dd>
              </div>
              {confirmedDistanceKm !== null ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Distance</dt>
                  <dd className="font-medium">{confirmedDistanceKm.toFixed(1)} km</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Fare</dt>
                <dd className="font-medium">₹{confirmedBooking.fare_amount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{confirmedBooking.status}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <LocationAutocomplete
            id="pickup-location"
            label="Pickup location"
            placeholder="Search or use current location"
            icon={<MapPinned className="h-4 w-4 shrink-0" />}
            value={pickup.text}
            onChange={handlePickupChange}
            onSelect={(location) => setPickup((current) => ({ text: current.text, location }))}
            allowCurrentLocation
            disabled={loading}
            hasError={pickupInvalid || sameLocation}
          />

          <LocationAutocomplete
            id="destination-location"
            label="Destination"
            placeholder="Search for your destination"
            icon={<Navigation2 className="h-4 w-4 shrink-0" />}
            value={destination.text}
            onChange={handleDestinationChange}
            onSelect={(location) => setDestination((current) => ({ text: current.text, location }))}
            disabled={loading}
            hasError={destinationInvalid || sameLocation}
          />
        </div>

        {sameLocation ? (
          <p className="mt-3 text-sm text-red-400">Pickup and destination cannot be the same place.</p>
        ) : null}

        <label className="mt-4 grid gap-2 text-sm font-medium">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Any special instructions for the driver?"
            disabled={loading}
            className="rounded-xl border border-input bg-background px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/60 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Route className="h-4 w-4" />
              Estimated distance
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {distanceKm !== null ? `${distanceKm.toFixed(1)} km` : '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {estimatedDuration !== null ? `~${estimatedDuration} min trip time` : 'Select both locations to estimate'}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/60 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Estimated fare
            </div>
            <p className="mt-2 text-2xl font-semibold">{estimatedFare !== null ? `₹${estimatedFare}` : '—'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Final fare may vary slightly with traffic and route</p>
          </div>
        </div>

        {formError ? (
          <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Confirming ride...' : 'Confirm ride'}
        </button>
      </form>
    </section>
  )
}