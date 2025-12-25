"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MapPin, Calendar, Users, Phone, Mail, Send, CheckCircle2, Loader2, Car, Plus, X, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { serviceLocations } from "@/data/service-locations" // added import

interface Location {
  id: string
  name: string
}

export default function TourInquirySection() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",        // new
    vehicleType: "",
    startDate: "",
    endDate: "",           // optional now
    adults: "1",           // new (strings to bind to inputs easily)
    children: "0",         // new
    comments: "",          // new
    locations: [{ id: "1", name: "" }],
  })
  const [numberOfDays, setNumberOfDays] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const vehicleTypes = [
    { 
      id: "sedan", 
      name: "Sedan", 
      icon: "🚗", 
      capacity: "1-3 passengers",
      pricePerDay: 80,
      image: "/api/placeholder/300/200"
    },
    { 
      id: "suv", 
      name: "SUV", 
      icon: "🚙", 
      capacity: "1-5 passengers",
      pricePerDay: 120,
      image: "/api/placeholder/300/200"
    },
    { 
      id: "van", 
      name: "Luxury Van", 
      icon: "🚐", 
      capacity: "6-8 passengers",
      pricePerDay: 180,
      image: "/api/placeholder/300/200"
    },
    { 
      id: "minibus", 
      name: "Mini Bus", 
      icon: "🚌", 
      capacity: "9-14 passengers",
      pricePerDay: 250,
      image: "/api/placeholder/300/200"
    },
  ]

  // Default popular list (we will merge with serviceLocations)
  const defaultPopular = [
    "Colombo", "Kandy", "Galle", "Sigiriya", "Ella", "Nuwara Eliya",
    "Dambulla", "Anuradhapura", "Yala", "Mirissa", "Hikkaduwa", "Arugam Bay"
  ]

  // Merge serviceLocations with defaultPopular to ensure list contains both sets (unique)
  const normalizeLocation = (loc: any) =>
    typeof loc === "string" ? loc : loc?.name ?? loc?.label ?? String(loc)
  const popularDestinations = Array.from(
    new Set([
      ...serviceLocations.map(normalizeLocation),
      ...defaultPopular,
    ])
  )
  


  // Calculate days only (no pricing)
  const calculateDays = (start: string, end: string) => {
    if (start) {
      if (end) {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        setNumberOfDays(days)
      } else {
        setNumberOfDays(1) // single day if no end date provided
      }
    } else {
      setNumberOfDays(0)
    }
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    calculateDays(
      field === 'startDate' ? value : formData.startDate,
      field === 'endDate' ? value : formData.endDate
    )
  }

  const handleVehicleChange = (vehicleId: string) => {
    setFormData(prev => ({ ...prev, vehicleType: vehicleId }))
    calculateDays(formData.startDate, formData.endDate)
  }

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, { id: Date.now().toString(), name: "" }]
    }))
  }

  const removeLocation = (id: string) => {
    if (formData.locations.length > 1) {
      setFormData(prev => ({
        ...prev,
        locations: prev.locations.filter(loc => loc.id !== id)
      }))
    }
  }

  const updateLocation = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === id ? { ...loc, name: value } : loc
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setCurrentStep(1)
      setFormData({
        name: "",
        email: "",
        phone: "",
        nationality: "",
        vehicleType: "",
        startDate: "",
        endDate: "",
        adults: "1",
        children: "0",
        comments: "",
        locations: [{ id: "1", name: "" }],
      })
      setNumberOfDays(0)
    }, 4000)
  }

  const canProceedToStep2 = formData.name && formData.email && formData.phone
  const canProceedToStep3 = canProceedToStep2 && formData.vehicleType && formData.startDate
  const canSubmit = canProceedToStep3 && formData.locations.some(loc => loc.name) && Number(formData.adults) > 0

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg"
          >
            <Sparkles className="h-5 w-5 text-gray-900" />
            <span className="text-gray-900 font-bold text-sm uppercase tracking-wider">
              Custom Multi-Day Tours
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Plan Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
              Multi-Day Adventure
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Tell us where you want to go, pick your vehicle, and get an instant quote. Our expert team will contact you to finalize your dream itinerary.
          </motion.p>
        </div>

        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-400 overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 sm:px-8 py-6">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {[
                  { num: 1, label: "Contact Info" },
                  { num: 2, label: "Tour Details" },
                  { num: 3, label: "Destinations" }
                ].map((step, index) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        currentStep >= step.num 
                          ? "bg-yellow-400 text-gray-900 shadow-lg scale-110" 
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {currentStep > step.num ? <CheckCircle2 className="h-5 w-5" /> : step.num}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                        currentStep >= step.num ? "text-white" : "text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all ${
                        currentStep > step.num ? "bg-yellow-400" : "bg-gray-700"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Request Received!</h3>
                    <p className="text-lg text-gray-600 mb-2">
                      Your tour inquiry has been submitted successfully.
                    </p>
                    <p className="text-gray-500 mb-6">
                      Our team will contact you within 2-4 hours to discuss your custom itinerary.
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Preparing your personalized quote...
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Contact Information */}
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              Let's Start With Your Details
                            </h3>
                            <p className="text-gray-600">We'll use this to send your quote and stay in touch</p>
                          </div>

                          <div className="space-y-5">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Your Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="John Smith"
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                <Phone className="inline h-4 w-4 mr-1" />
                                WhatsApp / Phone Number *
                              </label>
                              <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+94 77 123 4567"
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                <Mail className="inline h-4 w-4 mr-1" />
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="john@example.com"
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-base"
                              />
                            </div>

                            {/* Nationality / Country */}
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Where are you from? (Country / Nationality)
                              </label>
                              <input
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                                placeholder="e.g., Sri Lanka / United Kingdom"
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-base"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            disabled={!canProceedToStep2}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 py-6 text-lg font-bold rounded-xl transition-all hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group mt-8"
                          >
                            Continue to Tour Details
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 2: Tour Details */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              Choose Your Vehicle & Dates
                            </h3>
                            <p className="text-gray-600">Select the perfect ride for your journey</p>
                          </div>

                          {/* Vehicle Selection */}
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-4">
                              <Car className="inline h-5 w-5 mr-1" />
                              Select Vehicle Type *
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {vehicleTypes.map((vehicle) => (
                                <button
                                  key={vehicle.id}
                                  type="button"
                                  onClick={() => handleVehicleChange(vehicle.id)}
                                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                    formData.vehicleType === vehicle.id
                                      ? "border-yellow-400 bg-yellow-50 shadow-lg scale-105"
                                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                  }`}
                                >
                                  <div className="text-4xl mb-2">{vehicle.icon}</div>
                                  <div className="font-bold text-gray-900 mb-1">{vehicle.name}</div>
                                  <div className="text-xs text-gray-600 mb-2">{vehicle.capacity}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Start Date *
                              </label>
                              <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                End Date (optional)
                              </label>
                              <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                min={formData.startDate || new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          {/* Tour Summary - show duration only */}
                          {numberOfDays > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-6"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-sm text-gray-600 font-medium">Tour Duration</p>
                                  <p className="text-2xl font-bold text-gray-900">{numberOfDays} Days</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600 font-medium">Vehicle Selected</p>
                                  <p className="text-2xl font-bold text-gray-900">{vehicleTypes.find(v => v.id === formData.vehicleType)?.name || "-"}</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 text-center">
                                Final price and services will be confirmed with our team
                              </p>
                            </motion.div>
                          )}

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-6 text-lg font-bold rounded-xl transition-all"
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(3)}
                              disabled={!canProceedToStep3}
                              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 py-6 text-lg font-bold rounded-xl transition-all hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              Continue to Destinations
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Destinations */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              Add Your Destinations
                            </h3>
                            <p className="text-gray-600">Select from popular spots or add your own</p>
                          </div>

                          {/* Popular Destinations Quick Select - uses merged popularDestinations */}
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                              Popular Destinations
                            </label>
                            <div className="flex flex-wrap gap-2">
                            {popularDestinations.map((dest, idx) => {
                              const keySafe = `${dest}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
                              return (
                                <button
                                  key={`${keySafe}-${idx}`}
                                  type="button"
                                  onClick={() => {
                                    const emptyLocation = formData.locations.find(loc => !loc.name)
                                    if (emptyLocation) {
                                      updateLocation(emptyLocation.id, dest)
                                    } else {
                                      addLocation()
                                      setTimeout(() => {
                                        const newLocations = [...formData.locations, { id: Date.now().toString(), name: dest }]
                                        setFormData(prev => ({ ...prev, locations: newLocations }))
                                      }, 0)
                                    }
                                  }}
                                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                  {dest}
                                </button>
                              )
                            })}
                            </div>
                          </div>

                          {/* Manual Location Input */}
                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                              <MapPin className="inline h-5 w-5 mr-1" />
                              Your Tour Stops
                            </label>
                            <div className="space-y-3">
                              {formData.locations.map((location, index) => (
                                <motion.div
                                  key={location.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex gap-3 items-start"
                                >
                                  <div className="flex-shrink-0 w-8 h-11 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900 text-sm">
                                    {index + 1}
                                  </div>
                                  <input
                                    type="text"
                                    value={location.name}
                                    onChange={(e) => updateLocation(location.id, e.target.value)}
                                    placeholder={`Destination ${index + 1} (e.g., Sigiriya, Ella)`}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                  />
                                  {formData.locations.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeLocation(location.id)}
                                      className="flex-shrink-0 w-11 h-11 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-all"
                                    >
                                      <X className="h-5 w-5 text-red-600" />
                                    </button>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={addLocation}
                              className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                            >
                              <Plus className="h-5 w-5" />
                              Add Another Stop
                            </button>
                          </div>

                          {/* Additional guest inputs (Adults/Children) and comments */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Adults *
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={formData.adults}
                                onChange={(e) => setFormData(prev => ({ ...prev, adults: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Children
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={formData.children}
                                onChange={(e) => setFormData(prev => ({ ...prev, children: e.target.value }))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Additional Comments / Requirements
                            </label>
                            <textarea
                              value={formData.comments}
                              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                              placeholder="Any special requests, pickup points, luggage info, etc."
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                            />
                          </div>

                          {/* Final Summary - pricing removed; show duration, nationality and guest counts */}
                          {numberOfDays > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6"
                            >
                              <h4 className="text-xl font-bold mb-4">Your Tour Summary</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Duration:</span>
                                  <span className="font-bold">{numberOfDays} Days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Vehicle:</span>
                                  <span className="font-bold">
                                    {vehicleTypes.find(v => v.id === formData.vehicleType)?.name}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Destinations:</span>
                                  <span className="font-bold">
                                    {formData.locations.filter(loc => loc.name).length} Stops
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Nationality:</span>
                                  <span className="font-bold">{formData.nationality || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Guests (A/C):</span>
                                  <span className="font-bold">{formData.adults}/{formData.children}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-6 text-lg font-bold rounded-xl transition-all"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={!canSubmit || isSubmitting}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold rounded-xl transition-all hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Request Quote & Callback
                                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Contact Below */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 mb-4">Need help planning? Talk to us directly</p>
        <div className="flex justify-center gap-4">
          <a
            href="tel:+94777850529"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <Phone className="h-5 w-5" />
            Call Us
          </a>
          <a
            href="https://wa.me/94777850529"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </motion.div>

    </motion.div>
      </div>
  
   </section>
)
}
