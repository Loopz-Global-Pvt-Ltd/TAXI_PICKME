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
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#FCFCFF' }}>
        <div className="text-center space-y-5 p-5 rounded-lg">
        <div className="relative">
        <img 
          src="/gif/taxi-car-animation.gif" 
          alt="Loading..." 
          className="h-20 w-26 mx-auto"
        />
        </div>
          <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Loading Your Rides...</h2>
        <p className="text-sm text-gray-600">Preparing the best taxi experience for you</p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-4">
        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return <MapsContext.Provider value={{ isLoaded, loadError }}>{children}</MapsContext.Provider>
}