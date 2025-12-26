"use client" 

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Loader2 } from "lucide-react"
import MapPreview from "./mapPreview"
import { useMaps } from "@/components/providers/maps-provider"
import { calculateDistance, type DistanceResult } from "@/lib/utils/distance"

interface LocationData {
  displayName: string      // User-friendly name like "Sigiriya Lion Rock"
  address: string          // Full formatted address
  lat: number | null
  lng: number | null
}

export default function SearchForm() {
  const { isLoaded } = useMaps()
  const formRef = useRef<HTMLFormElement>(null)
  const pickupInputRef = useRef<HTMLInputElement | null>(null)
 const dropoffInputRef = useRef<HTMLInputElement | null>(null)
  
  const [pickupLocation, setPickupLocation] = useState<LocationData>({
    displayName: "",
    address: "",
    lat: null,
    lng: null,
  })
  const [dropoffLocation, setDropoffLocation] = useState<LocationData>({
    displayName: "",
    address: "",
    lat: null,
    lng: null,
  })
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [distanceInfo, setDistanceInfo] = useState<DistanceResult | null>(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const [distanceError, setDistanceError] = useState<string | null>(null)

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  // Calculate distance when both locations are selected
  useEffect(() => {
    const fetchDistance = async () => {
      if (
        pickupLocation.lat &&
        pickupLocation.lng &&
        dropoffLocation.lat &&
        dropoffLocation.lng
      ) {
        setIsCalculatingDistance(true)
        setDistanceError(null)

        try {
          const result = await calculateDistance(
            pickupLocation.lat,
            pickupLocation.lng,
            dropoffLocation.lat,
            dropoffLocation.lng
          )
          setDistanceInfo(result)
        } catch (error: any) {
          console.error('Distance calculation error:', error)
          setDistanceError('Unable to calculate distance. Please check your locations.')
          setDistanceInfo(null)
        } finally {
          setIsCalculatingDistance(false)
        }
      } else {
        setDistanceInfo(null)
        setDistanceError(null)
      }
    }

    fetchDistance()
  }, [pickupLocation, dropoffLocation])

  const onPickupLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setPickupAutocomplete(autocomplete)
  }, [])

  const onDropoffLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setDropoffAutocomplete(autocomplete)
  }, [])

  const onPickupPlaceChanged = useCallback(() => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace()
      if (place.geometry?.location) {
        // Use place.name (main text) as display name, fallback to formatted_address
        const displayName = place.name || place.formatted_address || ""
        
        setPickupLocation({
          displayName: displayName,
          address: place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      }
    }
  }, [pickupAutocomplete])

  const onDropoffPlaceChanged = useCallback(() => {
    if (dropoffAutocomplete) {
      const place = dropoffAutocomplete.getPlace()
      if (place.geometry?.location) {
        // Use place.name (main text) as display name, fallback to formatted_address
        const displayName = place.name || place.formatted_address || ""
        
        setDropoffLocation({
          displayName: displayName,
          address: place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      }
    }
  }, [dropoffAutocomplete])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pickupLocation.lat || !dropoffLocation.lat) {
      alert("Please select valid pickup and dropoff locations")
      return
    }

    if (!distanceInfo) {
      alert("Please wait while we calculate the distance")
      return
    }

    // Use displayName in URL params (user-friendly names)
    const queryParams = new URLSearchParams({
      pickup: pickupLocation.displayName,
      pickupLat: pickupLocation.lat.toString(),
      pickupLng: pickupLocation.lng.toString(),
      dropoff: dropoffLocation.displayName,
      dropoffLat: dropoffLocation.lat.toString(),
      dropoffLng: dropoffLocation.lng.toString(),
      distance: distanceInfo.distanceKm.toFixed(2),
      duration: distanceInfo.durationMinutes.toFixed(0),
      date: pickupDate,
      time: pickupTime,
      passengers: passengers,
    })

    window.location.href = `/search?${queryParams.toString()}`
  }

  // Listen for route selections from service-locations
    useEffect(() => {
        const handler = (e: Event) => {
          const detail = (e as CustomEvent).detail
          if (!detail) return
    
          // support multiple shapes:
          // 1) { pickup: "...", dropoff: "..." }
          // 2) { pickup: { displayName, address, lat, lng }, dropoff: {...} }
          // 3) a single string like "Airport to Kandy"
          let pickupVal = ""
          let dropoffVal = ""
          let pickupLat: number | null = null
          let pickupLng: number | null = null
          let dropoffLat: number | null = null
          let dropoffLng: number | null = null
    
          if (typeof detail === "string") {
            // try to split "From to To"
            const m = detail.match(/^(.*)\s+to\s+(.*)$/i)
            if (m) {
              pickupVal = m[1].trim()
              dropoffVal = m[2].trim()
            } else {
              pickupVal = detail
            }
          } else if (typeof detail === "object") {
            const maybe = (obj: any) => {
              if (!obj) return ""
             if (typeof obj === "string") return obj
             return obj.displayName || obj.name || obj.address || obj.formatted_address || ""
           }
  
           pickupVal = maybe(detail.pickup ?? detail.from ?? detail.pickupLocation)
           dropoffVal = maybe(detail.dropoff ?? detail.to ?? detail.dropoffLocation)
  
           const readLatLng = (obj: any) => {
             if (!obj) return { lat: null, lng: null }
             if (typeof obj === "object" && (obj.lat !== undefined || obj.lng !== undefined)) {
               return { lat: Number(obj.lat) || null, lng: Number(obj.lng) || null }
             }
             if (typeof obj === "object" && obj.geometry?.location) {
               return { lat: obj.geometry.location.lat?.(), lng: obj.geometry.location.lng?.() }
             }
             return { lat: null, lng: null }
            }
    
            const p = readLatLng(detail.pickup ?? detail.from ?? detail.pickupLocation)
            pickupLat = p.lat
            pickupLng = p.lng
            const d = readLatLng(detail.dropoff ?? detail.to ?? detail.dropoffLocation)
            dropoffLat = d.lat
            dropoffLng = d.lng
          }
    
          if (pickupVal) {
            setPickupLocation({
              displayName: pickupVal,
              address: pickupVal,
              lat: pickupLat ?? null,
              lng: pickupLng ?? null,
            })
          }
          if (dropoffVal) {
            setDropoffLocation({
              displayName: dropoffVal,
              address: dropoffVal,
              lat: dropoffLat ?? null,
              lng: dropoffLng ?? null,
            })
          }
    
          // scroll and focus pickup input
          setTimeout(() => {
            const el = formRef.current
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
            pickupInputRef.current?.focus()
          }, 50)
        }
    
        window.addEventListener("selectRoute", handler as EventListener)
        window.addEventListener("routeSelected", handler as EventListener)
        return () => {
          window.removeEventListener("selectRoute", handler as EventListener)
          window.removeEventListener("routeSelected", handler as EventListener)
        }
      }, [])
      useEffect(() => {
          if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
            const places = (window as any).google.maps.places
            if ((places as any).PlaceAutocompleteElement) {
              // recommend review/migration (silent log for devs)
              console.info("Note: google.maps.places.PlaceAutocompleteElement is available — consider migrating from Autocomplete per Google guidance.")
            }
          }
        }, [isLoaded])
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600">Loading search form...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Map Preview - Order 1 on mobile (top), Order 2 on desktop (right) */}
      <div className="h-[300px] sm:h-[350px] lg:h-[320px] w-full rounded-lg overflow-hidden order-1 lg:order-2">
        <MapPreview
          pickupLat={pickupLocation.lat ?? undefined}
          pickupLng={pickupLocation.lng ?? undefined}
          dropoffLat={dropoffLocation.lat ?? undefined}
          dropoffLng={dropoffLocation.lng ?? undefined}
        />
      </div>

      {/* Search Form - Order 2 on mobile (bottom), Order 1 on desktop (left) */}
      <form
        ref={formRef}
        onSubmit={handleSearch}
        className="space-y-3 sm:space-y-4 order-2 lg:order-1"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-black mb-2 font-semibold">
              <MapPin className="inline mr-2" size={20} />
              Pickup Location
            </label>
            <Autocomplete
              onLoad={onPickupLoad}
              onPlaceChanged={onPickupPlaceChanged}
              options={{
                componentRestrictions: { country: "lk" },
                fields: ["formatted_address", "geometry", "name"], // Include 'name' field
              }}
            >
              <input
                type="text"
                placeholder="Where are you?"
                ref={pickupInputRef}
                value={pickupLocation.displayName}
                onChange={(e) =>
                  setPickupLocation((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                    // clear lat/lng if user edits manually
                    lat: null,
                    lng: null,
                  }))
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold text-sm sm:text-base"
              />
            </Autocomplete>
          </div>

          {/* Dropoff Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-black mb-2 font-semibold">
              <MapPin className="inline mr-2" size={20} />
              Dropoff Location
            </label>
            <Autocomplete
              onLoad={onDropoffLoad}
              onPlaceChanged={onDropoffPlaceChanged}
              options={{
                componentRestrictions: { country: "lk" },
                fields: ["formatted_address", "geometry", "name"], // Include 'name' field
              }}
            >
              <input
                type="text"
                placeholder="Where to?"
                ref={dropoffInputRef}
                value={dropoffLocation.displayName}
                onChange={(e) =>
                  setDropoffLocation((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                    lat: null,
                    lng: null,
                  }))
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold placeholder:font-normal text-sm sm:text-base"
              />
            </Autocomplete>
          </div>
        </div>
        {/* Distance Information */}
        {isCalculatingDistance && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-900 font-medium">Calculating distance...</span>
          </div>
        )}

        {distanceError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">{distanceError}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium text-black mb-2 font-semibold">
              <Calendar className="inline mr-2" size={20}/>
              Pickup Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              required
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium text-black mb-2 font-semibold">Pickup Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-black mb-2 font-semibold">
            <Users className="inline mr-2" size={16} />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4-6 Passengers</option>
            <option value="7">7-10 Passengers</option>
          </select>
        </div>

        <div>
          <Button
            type="submit"
            disabled={!distanceInfo || isCalculatingDistance}
            className="w-full bg-black/80 hover:bg-black/90 text-white py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-lg transition-all hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculatingDistance ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Calculating...
              </>
            ) : (
              'Search Taxis'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}