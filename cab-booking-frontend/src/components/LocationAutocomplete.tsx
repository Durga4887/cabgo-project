import { useEffect, useRef, useState, type ReactNode } from 'react'

import { AlertCircle, Loader2, LocateFixed } from 'lucide-react'

import { getCurrentPosition, reverseGeocode, searchLocations, type LocationValue } from '@/lib/geocode'

interface LocationAutocompleteProps {
  id: string
  label: string
  placeholder: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  onSelect: (location: LocationValue | null) => void
  allowCurrentLocation?: boolean
  disabled?: boolean
  hasError?: boolean
}

const SEARCH_DEBOUNCE_MS = 400

export function LocationAutocomplete({
  id,
  label,
  placeholder,
  icon,
  value,
  onChange,
  onSelect,
  allowCurrentLocation = false,
  disabled = false,
  hasError = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationValue[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [helperError, setHelperError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const skipNextSearchRef = useRef(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false
      return
    }

    const trimmed = value.trim()

    if (trimmed.length < 3) {
      setSuggestions([])
      setHelperError(null)
      return
    }

    const timeoutId = window.setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsSearching(true)
      setHelperError(null)

      try {
        const results = await searchLocations(trimmed, controller.signal)
        setSuggestions(results)
        setIsOpen(true)

        if (results.length === 0) {
          setHelperError('No matching places found. Try a more specific search.')
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setHelperError('Could not load suggestions. Check your connection and try again.')
          setSuggestions([])
        }
      } finally {
        setIsSearching(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [value])

  const handleInputChange = (nextValue: string) => {
    onChange(nextValue)
    onSelect(null)
  }

  const handleSelectSuggestion = (suggestion: LocationValue) => {
    skipNextSearchRef.current = true
    onChange(suggestion.label)
    onSelect(suggestion)
    setSuggestions([])
    setIsOpen(false)
    setHelperError(null)
  }

  const handleUseCurrentLocation = async () => {
    setIsLocating(true)
    setHelperError(null)

    try {
      const position = await getCurrentPosition()
      const location = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude,
      )

      skipNextSearchRef.current = true
      onChange(location.label)
      onSelect(location)
      setSuggestions([])
      setIsOpen(false)
    } catch (error) {
      let message = 'Could not detect your current location. Please type it manually.'

      if (error && typeof error === 'object' && 'code' in error) {
        const geoError = error as GeolocationPositionError
        if (geoError.code === geoError.PERMISSION_DENIED) {
          message = 'Location permission denied. Please allow access or type your pickup manually.'
        }
      } else if (error instanceof Error && error.message) {
        message = error.message
      }

      setHelperError(message)
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <div ref={containerRef} className="relative grid gap-2 text-sm font-medium">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id}>{label}</label>

        {allowCurrentLocation ? (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={disabled || isLocating}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed className="h-3.5 w-3.5" />
            )}
            {isLocating ? 'Locating...' : 'Use current location'}
          </button>
        ) : null}
      </div>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-background px-4 py-3 text-muted-foreground ${
          hasError ? 'border-red-500/70' : 'border-input'
        }`}
      >
        {icon}
        <input
          id={id}
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled || isLocating}
          autoComplete="off"
          className="w-full bg-transparent outline-none disabled:cursor-not-allowed"
        />
        {isSearching ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : null}
      </div>

      {isOpen && suggestions.length > 0 ? (
        <ul className="absolute top-full z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-background shadow-lg">
          {suggestions.map((suggestion) => (
            <li key={`${suggestion.lat}-${suggestion.lon}`}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-4 py-2.5 text-left text-sm transition hover:bg-muted/70"
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {helperError ? (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {helperError}
        </p>
      ) : null}
    </div>
  )
}