"use client"

import { useState } from "react"
import { serviceLocations, airportRoutes } from "@/data/service-locations"
import { MapPin, Plane, ChevronDown, Search, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type TabType = "all" | "airport" | "beach" | "cultural" | "hill-country" | "wildlife" | "city"

export default function ServiceLocations() {
  const [activeTab, setActiveTab] = useState<TabType>("airport")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredLocations = serviceLocations.filter(location => {
    const matchesTab = activeTab === "all" || location.category === activeTab
    // const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab 
  })

  const displayedLocations = showAll ? filteredLocations : filteredLocations.slice(0, 20)
  const displayedAirportRoutes = showAll ? airportRoutes : airportRoutes.slice(0, 20)

  return (
    <section className="py-10 sm:py-10 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-3 sm:mb-5">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg">
            <MapPin className="h-5 w-5 text-gray-900" />
            <span className="text-gray-900 font-bold text-sm uppercase tracking-wider">
              Island-Wide Premium Service
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Taxi Service <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500"> Across Sri Lanka</span>
          </h2>
          {/* <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience premium transportation with fixed pricing, English-speaking drivers, 
            and 24/7 availability to all major destinations across the island.
          </p> */}

          {/* Trust Badges */}
          {/* <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Fixed Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Professional Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">24/7 Available</span>
            </div>
          </div> */}
        </div>

        {/* Premium Search Bar */}
        {/* <div className="max-w-3xl mx-auto mb-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-yellow-600 transition-colors" />
            <input
              type="text"
              placeholder="Search your destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 text-lg shadow-sm transition-all"
            />
          </div>
        </div> */}

        {/* Premium Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-5">
          {[
            { key: "airport", label: "Airport Transfers", icon: "✈️", gradient: "from-blue-500 to-blue-600" },
            { key: "beach", label: "Beach Destinations", icon: "🏖️", gradient: "from-cyan-500 to-blue-500" },
            { key: "cultural", label: "Cultural Sites", icon: "🏛️", gradient: "from-amber-500 to-orange-500" },
            { key: "hill-country", label: "Hill Country", icon: "⛰️", gradient: "from-green-500 to-emerald-600" },
            { key: "wildlife", label: "Wildlife Tours", icon: "🦁", gradient: "from-yellow-500 to-amber-600" },
            { key: "city", label: "Major Cities", icon: "🏙️", gradient: "from-purple-500 to-pink-500" },
            { key: "all", label: "All Destinations", icon: "🗺️", gradient: "from-gray-700 to-gray-900" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`group relative px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl ${
                activeTab === tab.key
                  ? `bg-gradient-to-r ${tab.gradient} text-white scale-105`
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.key && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Airport Routes Section - Premium Design */}
        {activeTab === "airport" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plane className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Airport Transfer Services
                  </h3>
                  <p className="text-gray-600 mt-1">Colombo BIA to any destination</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedAirportRoutes.map((route, index) => (
                <div
                  key={`${route.slug}-${index}`}
                  className="group relative p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                        <Plane className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                          {route.route}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">Fixed pricing • 24/7 available</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* City/Destination Services - Premium Grid */}
        {activeTab !== "airport" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-7 w-7 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {activeTab === "all" ? "All Service Locations" : 
                     `${activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Destinations`}
                  </h3>
                  <p className="text-gray-600 mt-1">{displayedLocations.length} locations available</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayedLocations.map((location) => (
                <div
                  key={location.id}
                  className="group relative p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-yellow-400 hover:shadow-xl transition-all duration-300 text-center overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                      <MapPin className="h-8 w-8 text-yellow-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-yellow-600 text-base transition-colors">
                        {location.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{location.district}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button - Premium Style */}
        {((activeTab === "airport" && airportRoutes.length > 24) ||
          (activeTab !== "airport" && filteredLocations.length > 24)) && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-10 py-6 rounded-2xl text-lg font-bold transition-all hover:shadow-2xl shadow-xl"
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronDown className="ml-3 h-6 w-6 rotate-180 group-hover:-translate-y-1 transition-transform" />
                </>
              ) : (
                <>
                  View All {activeTab === "airport" ? airportRoutes.length : filteredLocations.length} Locations
                  <ChevronDown className="ml-3 h-6 w-6 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Premium SEO Section */}
        <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
              Professional Taxi Service Coverage Across Sri Lanka
            </h3>
            <div className="h-1 w-24 bg-yellow-400 rounded-full mb-2" />
            <p className="text-gray-200 leading-relaxed text-lg">
              <strong className="text-yellow-400">Taxi Sri Lanka Tours</strong> provides comprehensive premium taxi and cab services 
              to all major destinations across the island. Whether you need an <strong className="text-white">airport transfer 
              from Colombo Airport (BIA)</strong>, a taxi to beach destinations like <strong className="text-white">Hikkaduwa, 
              Mirissa, or Arugam Bay</strong>, cultural site visits to <strong className="text-white">Sigiriya, Kandy, 
              or Anuradhapura</strong>, or hill country tours to <strong className="text-white">Nuwara Eliya and Ella</strong>, 
              we've got you covered with professional English-speaking drivers, fixed transparent pricing, and 24/7 availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
