"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Clock, TrendingUp, Car } from "lucide-react"
import { useMaps } from "./providers/maps-provider"

interface MapPreviewProps {
  pickupLat?: number
  pickupLng?: number
  dropoffLat?: number
  dropoffLng?: number
  showDrivers?: boolean // Option to show/hide drivers
}

interface Driver {
  id: number
  lat: number
  lng: number
  marker?: google.maps.Marker
}

export default function MapPreview({ 
  pickupLat, 
  pickupLng, 
  dropoffLat, 
  dropoffLng,
  showDrivers = true 
}: MapPreviewProps) {
  const { isLoaded } = useMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const driversRef = useRef<Driver[]>([])
  const [distance, setDistance] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [distanceValue, setDistanceValue] = useState<number>(0)
  const [nearbyDrivers, setNearbyDrivers] = useState<number>(0)

  // Generate nearby drivers based on pickup location (only on roads/land)
// Generate nearby drivers based on pickup location (only on roads/land)
const generateNearbyDrivers = async (
  centerLat: number, 
  centerLng: number, 
  count: number = 6
): Promise<Driver[]> => {
  const drivers: Driver[] = []
  const directionsService = new google.maps.DirectionsService()
  const geocoder = new google.maps.Geocoder()
  
  // Generate drivers along actual roads by creating short routes in different directions
  const angles = Array.from({ length: count * 2 }, (_, i) => (i * 360) / (count * 2)) // Try more angles
  
  let attempts = 0
  const maxAttempts = count * 3 // Try up to 3x the needed count
  
  while (drivers.length < count && attempts < maxAttempts) {
    try {
      const angle = angles[attempts % angles.length] + (Math.random() - 0.5) * 20
      const distance = 3 + Math.random() * 3 // 1-4 km away
      
      // Calculate destination point
      const destLat = centerLat + (distance / 111) * Math.cos(angle * Math.PI / 180)
      const destLng = centerLng + (distance / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle * Math.PI / 180)
      
      // First verify destination is on land using reverse geocoding
      const geoResult = await geocoder.geocode({
        location: { lat: destLat, lng: destLng }
      })
      
      // Check if location has a valid address (indicates land/road)
      if (geoResult.results && geoResult.results.length > 0) {
        // Use Directions API to find a point on actual roads
        const result = await directionsService.route({
          origin: { lat: centerLat, lng: centerLng },
          destination: { lat: destLat, lng: destLng },
          travelMode: google.maps.TravelMode.DRIVING,
        })
        
        if (result.routes[0]?.legs[0]) {
          const leg = result.routes[0].legs[0]
          // Pick a random point along the route (20-80% of the way)
          const stepIndex = Math.floor(leg.steps.length * (0.2 + Math.random() * 0.6))
          const step = leg.steps[Math.min(stepIndex, leg.steps.length - 1)]
          
          if (step?.end_location) {
            const driverLat = step.end_location.lat()
            const driverLng = step.end_location.lng()
            
            // Final verification: ensure this point is also on land
            const finalGeoResult = await geocoder.geocode({
              location: { lat: driverLat, lng: driverLng }
            })
            
            if (finalGeoResult.results && finalGeoResult.results.length > 0) {
              drivers.push({
                id: drivers.length,
                lat: driverLat,
                lng: driverLng,
              })
            }
          }
        }
      }
    } catch (error) {
      console.log('Failed to place driver, trying another location')
    }
    
    attempts++
  }
  
  // If we couldn't get enough drivers with strict validation, fill remaining with nearby road points
  if (drivers.length < count) {
    console.log(`Only found ${drivers.length} valid driver locations out of ${count} requested`)
  }
  
  return drivers
}

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 },
      zoom: 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a0d4f7" }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#c3f7ba" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }],
        },
      ],
    })

    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#0560f5",
        strokeWeight: 6,
        strokeOpacity: 0.9,
      },
    })
  }, [isLoaded])

  // Add and update driver markers
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !showDrivers) return

    // Clear existing driver markers
    driversRef.current.forEach(driver => {
      driver.marker?.setMap(null)
    })

    // Add driver markers if pickup location exists
    if (pickupLat && pickupLng) {
      // Use async function to generate drivers on roads
      generateNearbyDrivers(pickupLat, pickupLng, 6).then(drivers => {
        setNearbyDrivers(drivers.length)
        
        driversRef.current = drivers.map(driver => {
          // Car icon using a simple, reliable approach
          const carIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 64 64" xml:space="preserve">
            <style type="text/css">
              .st0{display:none;fill:#2B3544;}
              .st1{fill:#E0E0D1;}
              .st2{opacity:0.2;fill:#231F20;}
              .st3{fill:#4F5D73;}
              .st4{opacity:0.2;}
              .st5{fill:#231F20;}
              .st6{fill:none;stroke:#C75C5C;stroke-width:4;stroke-miterlimit:10;}
              .st7{fill:#C75C5C;stroke:#C75C5C;stroke-width:4;stroke-miterlimit:10;}
              .st8{fill:#F5CF87;stroke:#C75C5C;stroke-width:2;stroke-miterlimit:10;}
            </style>
            <rect x="-223" y="-1765" class="st0" width="608" height="1984"/>
            <circle class="st1" cx="32" cy="32" r="32"/>
            <g>
              <path class="st2" d="M20,50c0,1.1-0.9,2-2,2h-2c-1.1,0-2-0.9-2-2V39c0-1.1,0.9-2,2-2h2c1.1,0,2,0.9,2,2V50z"/>
              <path class="st2" d="M50,50c0,1.1-0.9,2-2,2h-2c-1.1,0-2-0.9-2-2V39c0-1.1,0.9-2,2-2h2c1.1,0,2,0.9,2,2V50z"/>
              <path class="st3" d="M20,48c0,1.1-0.9,2-2,2h-2c-1.1,0-2-0.9-2-2V37c0-1.1,0.9-2,2-2h2c1.1,0,2,0.9,2,2V48z"/>
              <path class="st3" d="M50,48c0,1.1-0.9,2-2,2h-2c-1.1,0-2-0.9-2-2V37c0-1.1,0.9-2,2-2h2c1.1,0,2,0.9,2,2V48z"/>
              <g class="st4">
                <path class="st5" d="M44,37H20c-3.3,0-6-2.7-6-6l0-0.4l2-10.1C17,17,19.2,15,22,15h20c2.8,0,5,2,5.9,5.5l0,0.1L50,31
                  C50,34.3,47.3,37,44,37z M18,31.2c0.1,1,0.9,1.8,2,1.8h24c1,0,1.9-0.8,2-1.8l-1.9-9.7C43.8,20.7,43.2,19,42,19H22
                  c-1.2,0-1.8,1.7-2.1,2.5L18,31.2z"/>
              </g>
              <path class="st6" d="M48,29c0,2.2-1.8,4-4,4H20c-2.2,0-4-1.8-4-4l2-10c0.5-2,1.8-4,4-4h20c2.2,0,3.5,2,4,4L48,29z"/>
              <g class="st4">
                <path class="st5" d="M52,42c0,2.2-1.8,4-4,4H16c-2.2,0-4-1.8-4-4v-5c0-2.2,1.8-4,4-4h32c2.2,0,4,1.8,4,4V42z"/>
                <path class="st5" d="M48,48H16c-3.3,0-6-2.7-6-6v-5c0-3.3,2.7-6,6-6h32c3.3,0,6,2.7,6,6v5C54,45.3,51.3,48,48,48z M16,35
                  c-1.1,0-2,0.9-2,2v5c0,1.1,0.9,2,2,2h32c1.1,0,2-0.9,2-2v-5c0-1.1-0.9-2-2-2H16z"/>
              </g>
              <path class="st7" d="M52,40c0,2.2-1.8,4-4,4H16c-2.2,0-4-1.8-4-4v-5c0-2.2,1.8-4,4-4h32c2.2,0,4,1.8,4,4V40z"/>
              <path class="st8" d="M21,38c0,2.2-1.8,4-4,4l0,0c-2.2,0-4-1.8-4-4l0,0c0-2.2,1.8-4,4-4l0,0C19.2,34,21,35.8,21,38L21,38z"/>
              <path class="st8" d="M51,38c0,2.2-1.8,4-4,4l0,0c-2.2,0-4-1.8-4-4l0,0c0-2.2,1.8-4,4-4l0,0C49.2,34,51,35.8,51,38L51,38z"/>
            </g>
            </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16),
          }

          const marker = new google.maps.Marker({
            position: { lat: driver.lat, lng: driver.lng },
            map: mapInstanceRef.current,
            icon: carIcon,
            zIndex: 1,
          })

          return { ...driver, marker }
        })
      })

      // Simulate driver movement along roads
      const moveInterval = setInterval(() => {
        driversRef.current.forEach(driver => {
          if (driver.marker && pickupLat && pickupLng) {
            const currentPos = driver.marker.getPosition()
            if (currentPos) {
              // Smaller movements to keep on roads
              const newLat = currentPos.lat() + (Math.random() - 0.5) * 0.002
              const newLng = currentPos.lng() + (Math.random() - 0.5) * 0.002
              driver.marker.setPosition({ lat: newLat, lng: newLng })
            }
          }
        })
      }, 10000) // Move every 10 seconds

      return () => {
        clearInterval(moveInterval)
        driversRef.current.forEach(driver => driver.marker?.setMap(null))
      }
    }
  }, [isLoaded, pickupLat, pickupLng, showDrivers])

  // Update markers and route
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    pickupMarkerRef.current?.setMap(null)
    dropoffMarkerRef.current?.setMap(null)

    const bounds = new google.maps.LatLngBounds()

    // Add pickup marker with custom icon
    if (pickupLat && pickupLng) {
      pickupMarkerRef.current = new google.maps.Marker({
        position: { lat: pickupLat, lng: pickupLng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 4,
        },
        label: {
          text: "A",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "14px",
        },
        animation: google.maps.Animation.DROP,
        zIndex: 100, // Keep pickup/dropoff markers on top
      })

      bounds.extend({ lat: pickupLat, lng: pickupLng })
    }

    // Add dropoff marker with custom icon
    if (dropoffLat && dropoffLng) {
      dropoffMarkerRef.current = new google.maps.Marker({
        position: { lat: dropoffLat, lng: dropoffLng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 4,
        },
        label: {
          text: "B",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "14px",
        },
        animation: google.maps.Animation.DROP,
        zIndex: 100, // Keep pickup/dropoff markers on top
      })

      bounds.extend({ lat: dropoffLat, lng: dropoffLng })
    }

    // Calculate and display route
    if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
      const directionsService = new google.maps.DirectionsService()

      directionsService.route(
        {
          origin: { lat: pickupLat, lng: pickupLng },
          destination: { lat: dropoffLat, lng: dropoffLng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result)

            const route = result.routes[0]
            if (route.legs[0]) {
              setDistance(route.legs[0].distance?.text || "")
              setDuration(route.legs[0].duration?.text || "")
              setDistanceValue(route.legs[0].distance?.value || 0)
            }
          }
        }
      )

      mapInstanceRef.current.fitBounds(bounds, { top: 80, bottom: 80, left: 80, right: 80 })
    } else if (pickupLat && pickupLng) {
      mapInstanceRef.current.setCenter({ lat: pickupLat, lng: pickupLng })
      mapInstanceRef.current.setZoom(12)
    } else if (dropoffLat && dropoffLng) {
      mapInstanceRef.current.setCenter({ lat: dropoffLat, lng: dropoffLng })
      mapInstanceRef.current.setZoom(12)
    }
  }, [isLoaded, pickupLat, pickupLng, dropoffLat, dropoffLng])

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-600 font-medium">Loading map preview...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400"
    >
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />

      {/* Route Info Card - Top Left */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden max-w-[200px] md:max-w-xs"
        >
          <div className="p-2 md:p-4 space-y-2 md:space-y-4">
            {/* Pickup Point */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] md:text-xs font-bold">A</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-600 font-medium">Pickup</p>
            </div>

            {/* Dropoff Point */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] md:text-xs font-bold">B</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-600 font-medium">Drop-off</p>
            </div>

            {/* Route Info */}
            <div className="pt-1 md:pt-2 border-t border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-700">
                <TrendingUp className="text-yellow-500 flex-shrink-0" size={12} />
                <span className="text-[10px] md:text-xs font-medium truncate">{distance}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Clock className="text-blue-500 flex-shrink-0" size={12} />
                <span className="text-[10px] md:text-xs font-medium truncate">{duration}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Drivers Badge - Top Right */}
      {/* {showDrivers && nearbyDrivers > 0 && pickupLat && pickupLng && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 right-3 bg-green-500/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 md:px-4 md:py-3"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Car className="text-white w-4 h-4 md:w-5 md:h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-white">
              <p className="text-[10px] md:text-xs font-bold">{nearbyDrivers} Drivers</p>
              <p className="text-[8px] md:text-[10px] opacity-90">Nearby</p>
            </div>
          </div>
        </motion.div>
      )} */}

      {/* Map Legend - Bottom Right */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs font-medium text-gray-700">Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-xs font-medium text-gray-700">Drop-off</span>
        </div>
        {showDrivers && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs font-medium text-gray-700">Drivers</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-yellow-400 rounded"></div>
          <span className="text-xs font-medium text-gray-700">Route</span>
        </div>
      </motion.div> */}

      {/* Decorative gradient overlay on edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>
    </motion.div>
  )
}