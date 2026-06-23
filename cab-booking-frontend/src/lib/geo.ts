export type GeoPoint = {
  lat: number
  lon: number
}

const EARTH_RADIUS_KM = 6371

const BASE_FARE = 40
const PER_KM_RATE = 12
const MIN_FARE = 60
const AVERAGE_SPEED_KMH = 25

function toRadians(value: number): number {
  return (value * Math.PI) / 180
}

export function calculateDistanceKm(from: GeoPoint, to: GeoPoint): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLon = toRadians(to.lon - from.lon)

  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

export function estimateFare(distanceKm: number): number {
  const fare = BASE_FARE + distanceKm * PER_KM_RATE
  return Math.round(Math.max(fare, MIN_FARE))
}

export function estimateDurationMinutes(distanceKm: number): number {
  const hours = distanceKm / AVERAGE_SPEED_KMH
  return Math.max(2, Math.round(hours * 60))
}