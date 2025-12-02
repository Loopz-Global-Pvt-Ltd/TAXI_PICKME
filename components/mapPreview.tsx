"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Navigation, Clock, MapPin, TrendingUp, Star } from "lucide-react"
import { useMaps } from "./providers/maps-provider"

interface MapPreviewProps {
  pickupLat?: number
  pickupLng?: number
  dropoffLat?: number
  dropoffLng?: number
}

export default function MapPreview({ pickupLat, pickupLng, dropoffLat, dropoffLng }: MapPreviewProps) {
  const { isLoaded } = useMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null)
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const [distance, setDistance] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [distanceValue, setDistanceValue] = useState<number>(0)

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
          stylers: [{ color: "#f5f5f5" }],
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
        strokeColor: "#FCD34D",
        strokeWeight: 6,
        strokeOpacity: 0.9,
      },
    })
  }, [isLoaded])

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
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-600 font-medium">Loading map preview...</p>
      </div>
    )
  }

  const estimatedCost = distanceValue > 0 ? Math.round((distanceValue / 1000) * 150) : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400"
    >
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />

      {/* Route Info Card - Enhanced */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 left-3 bg-white/60 rounded-2xl shadow-2xl overflow-hidden max-w-xs"
        >
   

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Pickup Point */}
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pickup</p>
                {/* <p className="text-sm font-semibold text-gray-900">Starting Point</p> */}
              </div>
            </div>


            {/* Dropoff Point */}
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Drop-off</p>
                {/* <p className="text-sm font-semibold text-gray-900">Destination</p> */}
              </div>
            </div>

            
            {/* Route Line */}
            <div className="flex items-center gap-2 pl-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-700">
                  <TrendingUp className="text-yellow-500" size={16} />
                  <span className="text-xs font-medium">{distance}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mt-1">
                  <Clock className="text-blue-500" size={16} />
                  <span className="text-xs font-medium">{duration}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Map Legend - Bottom Right */}
      <motion.div
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-yellow-400 rounded"></div>
          <span className="text-xs font-medium text-gray-700">Route</span>
        </div>
      </motion.div>

      {/* Decorative gradient overlay on edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>
    </motion.div>
  )
}