// components/search-form.tsx
"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Loader2, Navigation } from "lucide-react"
import MapPreview from "./mapPreview"
import { useMaps } from "@/components/providers/maps-provider"
import { calculateDistance, type DistanceResult } from "@/lib/utils/distance"

interface LocationData {
  address: string
  lat: number | null
  lng: number | null
}

export default function SearchForm() {
  const { isLoaded } = useMaps()
  const formRef = useRef<HTMLFormElement>(null)
  const [formHeight, setFormHeight] = useState<number>(0)
  const [pickupLocation, setPickupLocation] = useState<LocationData>({
    address: "",
    lat: null,
    lng: null,
  })
  const [dropoffLocation, setDropoffLocation] = useState<LocationData>({
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
        setPickupLocation({
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
        setDropoffLocation({
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

    const queryParams = new URLSearchParams({
      pickup: pickupLocation.address,
      pickupLat: pickupLocation.lat.toString(),
      pickupLng: pickupLocation.lng.toString(),
      dropoff: dropoffLocation.address,
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600">Loading search form...</span>
      </div>
    )
  }

  useEffect(() => {
    if (formRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setFormHeight(entry.contentRect.height)
        }
      })
      
      resizeObserver.observe(formRef.current)
      
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {/* Left Side - Search Form */}
      <form
        ref={formRef}
        onSubmit={handleSearch}
        className="space-y-2 sm:space-y-3"
      >
        <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-1.5 font-semibold">
              <MapPin className="inline mr-1" size={14} />
              Pickup Location
            </label>
            <Autocomplete
              onLoad={onPickupLoad}
              onPlaceChanged={onPickupPlaceChanged}
              options={{
                componentRestrictions: { country: "lk" },
                fields: ["formatted_address", "geometry", "name"],
              }}
            >
              <input
                type="text"
                placeholder="Where are you?"
                defaultValue={pickupLocation.address}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold text-xs sm:text-sm"
              />
            </Autocomplete>
          </div>

          {/* Dropoff Location */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-1.5 font-semibold">
              <MapPin className="inline mr-1" size={14} />
              Dropoff Location
            </label>
            <Autocomplete
              onLoad={onDropoffLoad}
              onPlaceChanged={onDropoffPlaceChanged}
              options={{
                componentRestrictions: { country: "lk" },
                fields: ["formatted_address", "geometry", "name"],
              }}
            >
              <input
                type="text"
                placeholder="Where to?"
                defaultValue={dropoffLocation.address}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold placeholder:font-normal text-xs sm:text-sm"
              />
            </Autocomplete>
          </div>
        </div>

        {/* Distance Information */}
        {isCalculatingDistance && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
            <span className="text-xs sm:text-sm text-blue-900 font-medium">Calculating distance...</span>
          </div>
        )}

        {distanceInfo && !isCalculatingDistance && (
          <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-green-900 mb-1.5">Route Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <p className="text-green-700 font-medium text-xs">Distance</p>
                    <p className="text-green-900 font-bold text-sm">{distanceInfo.distanceText}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium text-xs">Estimated Time</p>
                    <p className="text-green-900 font-bold text-sm">{distanceInfo.durationText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {distanceError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-900">{distanceError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* Pickup Date */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-1.5 font-semibold">
              <Calendar className="inline mr-1" size={14} />
              Pickup Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm"
              required
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-1.5 font-semibold">Pickup Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-1.5 font-semibold">
            <Users className="inline mr-1" size={14} />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm"
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
            className="w-full bg-black/80 hover:bg-black/90 text-white py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculatingDistance ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              'Search Available Taxis'
            )}
          </Button>
        </div>
      </form>

      {/* Right Side - Map Preview (visible on all screen sizes) */}
      <div 
        className="w-full rounded-lg overflow-hidden"
        style={{ 
          height: formHeight > 0 ? `${formHeight}px` : 'auto',
          minHeight: '250px'
        }}
      >
        <MapPreview
          pickupLat={pickupLocation.lat ?? undefined}
          pickupLng={pickupLocation.lng ?? undefined}
          dropoffLat={dropoffLocation.lat ?? undefined}
          dropoffLng={dropoffLocation.lng ?? undefined}
        />
      </div>
    </div>
  )
}