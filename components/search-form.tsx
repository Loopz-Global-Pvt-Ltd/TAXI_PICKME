"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useLoadScript, Autocomplete } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const libraries: ("places")[] = ["places"]

interface LocationData {
  address: string
  lat: number | null
  lng: number | null
}

export default function SearchForm() {
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

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

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
    
    // Validate that locations are selected
    if (!pickupLocation.lat || !dropoffLocation.lat) {
      alert("Please select valid pickup and dropoff locations")
      return
    }

    // Navigate to search results with location data
    const queryParams = new URLSearchParams({
      pickup: pickupLocation.address,
      pickupLat: pickupLocation.lat.toString(),
      pickupLng: pickupLocation.lng.toString(),
      dropoff: dropoffLocation.address,
      dropoffLat: dropoffLocation.lat.toString(),
      dropoffLng: dropoffLocation.lng.toString(),
      date: pickupDate,
      time: pickupTime,
      passengers: passengers,
    })

    window.location.href = `/search?${queryParams.toString()}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  if (loadError) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading Google Maps API. Please check your API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600">Loading search form...</span>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Location */}
        <motion.div variants={itemVariants} className="relative">
          <label className="block text-sm font-medium text-black mb-2">
            <MapPin className="inline mr-2" size={16} />
            Pickup Location
          </label>
          <Autocomplete
            onLoad={onPickupLoad}
            onPlaceChanged={onPickupPlaceChanged}
            options={{
              componentRestrictions: { country: "lk" }, // Restrict to Sri Lanka
              fields: ["formatted_address", "geometry", "name"],
            }}
          >
            <input
              type="text"
              placeholder="Where are you?"
              defaultValue={pickupLocation.address}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
          </Autocomplete>
        </motion.div>

        {/* Dropoff Location */}
        <motion.div variants={itemVariants} className="relative">
          <label className="block text-sm font-medium text-black mb-2">
            <MapPin className="inline mr-2" size={16} />
            Dropoff Location
          </label>
          <Autocomplete
            onLoad={onDropoffLoad}
            onPlaceChanged={onDropoffPlaceChanged}
            options={{
              componentRestrictions: { country: "lk" }, // Restrict to Sri Lanka
              fields: ["formatted_address", "geometry", "name"],
            }}
          >
            <input
              type="text"
              placeholder="Where to?"
              defaultValue={dropoffLocation.address}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
          </Autocomplete>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pickup Date */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-black mb-2">
            <Calendar className="inline mr-2" size={16} />
            Pickup Date
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </motion.div>

        {/* Pickup Time */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-black mb-2">Time</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </motion.div>

        {/* Passengers */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-black mb-2">
            <Users className="inline mr-2" size={16} />
            Passengers
          </label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4-6 Passengers</option>
            <option value="7">7-10 Passengers</option>
          </select>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="w-full bg-black hover:bg-black/90 text-white py-6 text-lg font-semibold rounded-lg transition-all hover:shadow-lg"
        >
          Search Available Taxis
        </Button>
      </motion.div>
    </motion.form>
  )
}