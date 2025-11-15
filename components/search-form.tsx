"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const POPULAR_DESTINATIONS = [
  "Colombo Airport (CMB)",
  "Galle",
  "Kandy",
  "Sigiriya",
  "Ella",
  "Nuwara Eliya",
  "Mirissa",
  "Negombo",
]

export default function SearchForm() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)

  const filteredDestinations = (input: string) => {
    return POPULAR_DESTINATIONS.filter((dest) => dest.toLowerCase().includes(input.toLowerCase()))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/search?pickup=${pickupLocation}&dropoff=${dropoffLocation}&date=${pickupDate}&time=${pickupTime}&passengers=${passengers}`
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
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => {
              setPickupLocation(e.target.value)
              setShowPickupSuggestions(true)
            }}
            onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
            placeholder="Where are you?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {showPickupSuggestions && pickupLocation && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-20 shadow-lg">
              {filteredDestinations(pickupLocation).map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => {
                    setPickupLocation(dest)
                    setShowPickupSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-yellow-100 first:rounded-t-lg last:rounded-b-lg text-black"
                >
                  {dest}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Dropoff Location */}
        <motion.div variants={itemVariants} className="relative">
          <label className="block text-sm font-medium text-black mb-2">
            <MapPin className="inline mr-2" size={16} />
            Dropoff Location
          </label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={(e) => {
              setDropoffLocation(e.target.value)
              setShowDropoffSuggestions(true)
            }}
            onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
            placeholder="Where to?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {showDropoffSuggestions && dropoffLocation && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-20 shadow-lg">
              {filteredDestinations(dropoffLocation).map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => {
                    setDropoffLocation(dest)
                    setShowDropoffSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-yellow-100 first:rounded-t-lg last:rounded-b-lg text-black"
                >
                  {dest}
                </button>
              ))}
            </div>
          )}
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
