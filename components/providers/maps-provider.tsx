"use client"

import { useLoadScript } from "@react-google-maps/api"
import { createContext, useContext, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry"]

interface MapsContextType {
  isLoaded: boolean
  loadError: Error | undefined
}

const MapsContext = createContext<MapsContextType>({
  isLoaded: false,
  loadError: undefined,
})

export const useMaps = () => useContext(MapsContext)

export function MapsProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600 p-4">
          Error loading Google Maps. Please check your API key.
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600">Loading Your Rides...</span>
      </div>
    )
  }

  return <MapsContext.Provider value={{ isLoaded, loadError }}>{children}</MapsContext.Provider>
}