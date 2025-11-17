"use client"

import { useEffect, useRef, useState } from "react"
import { useLoadScript } from "@react-google-maps/api"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useMaps } from "./providers/maps-provider"


const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry"]

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

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  //   libraries,
  // })

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
      zoom: 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3b82f6",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    })
  }, [isLoaded])

  // Update markers and route
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    // Clear existing markers
    pickupMarkerRef.current?.setMap(null)
    dropoffMarkerRef.current?.setMap(null)

    const bounds = new google.maps.LatLngBounds()

    // Add pickup marker
    if (pickupLat && pickupLng) {
      pickupMarkerRef.current = new google.maps.Marker({
        position: { lat: pickupLat, lng: pickupLng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        label: {
          text: "A",
          color: "#ffffff",
          fontWeight: "bold",
        },
        animation: google.maps.Animation.DROP,
      })

      bounds.extend({ lat: pickupLat, lng: pickupLng })
    }

    // Add dropoff marker
    if (dropoffLat && dropoffLng) {
      dropoffMarkerRef.current = new google.maps.Marker({
        position: { lat: dropoffLat, lng: dropoffLng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        label: {
          text: "B",
          color: "#ffffff",
          fontWeight: "bold",
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

            // Extract distance and duration
            const route = result.routes[0]
            if (route.legs[0]) {
              setDistance(route.legs[0].distance?.text || "")
              setDuration(route.legs[0].duration?.text || "")
            }
          }
        }
      )

      mapInstanceRef.current.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 })
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
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-100 rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl"
    >
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />

      {/* Route Info Overlay */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Drop-off</span>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600">Distance: <strong>{distance}</strong></p>
            <p className="text-xs text-gray-600">Duration: <strong>{duration}</strong></p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}