export type LocationValue = {
  label: string
  lat: number
  lon: number
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationValue[]> {
  const trimmed = query.trim()

  if (trimmed.length < 3) {
    return []
  }

  const params = new URLSearchParams({
    format: 'json',
    addressdetails: '0',
    limit: '5',
    q: trimmed,
  })

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?${params.toString()}`,
    {
      signal,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Unable to fetch location suggestions right now.')
  }

  const data = (await response.json()) as NominatimResult[]

  return data.map((item) => ({
    label: item.display_name,
    lat: Number.parseFloat(item.lat),
    lon: Number.parseFloat(item.lon),
  }))
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<LocationValue> {
  const params = new URLSearchParams({
    format: 'json',
    lat: String(lat),
    lon: String(lon),
  })

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`,
    {
      signal,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Unable to resolve your current address.')
  }

  const data = (await response.json()) as { display_name?: string }

  return {
    label: data.display_name ?? `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    lat,
    lon,
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported in this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  })
}