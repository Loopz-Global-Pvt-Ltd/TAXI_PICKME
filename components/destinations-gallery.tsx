"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ChevronDown, Sparkles } from "lucide-react"
import { destinations, type Destination } from "@/data/destinations"
import { Button } from "@/components/ui/button"

const ITEMS_PER_LOAD = 6

export default function DestinationsGallery() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)
  const [isExpanding, setIsExpanding] = useState(false)

  const visibleDestinations = destinations.slice(0, visibleCount)
  const hasMore = visibleCount < destinations.length

  const handleLoadMore = () => {
    setIsExpanding(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, destinations.length))
      setIsExpanding(false)
    }, 300)
  }

  return (
    <section className="py-6 sm:py-16 lg:py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Explore Sri Lankan Destinations
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover amazing deals across Sri Lanka's most breathtaking locations. 
            From ancient fortresses to pristine beaches and lush tea plantations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visibleDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
              isExpanding={isExpanding}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8 sm:mt-12">
            <Button
              onClick={handleLoadMore}
              disabled={isExpanding}
              className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all hover:shadow-xl group"
            >
              {isExpanding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Explore More Destinations
                  <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              {destinations.length - visibleCount} more destinations to explore
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function DestinationCard({ 
  destination, 
  index, 
  isExpanding 
}: { 
  destination: Destination
  index: number
  isExpanding: boolean
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500  ${
        isExpanding ? "animate-fade-in" : ""
      }`}
      style={{
        animationDelay: `${(index % ITEMS_PER_LOAD) * 100}ms`
      }}
    >
      {/* <Link href={`/destinations/${destination.slug}`} className="block"> */}
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-200">
          <Image
            src={destination.imageUrl}
            alt={`${destination.name} - ${destination.description}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={index < ITEMS_PER_LOAD ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB8h/9k="
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Location Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <MapPin className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-semibold text-gray-900">{destination.location}</span>
          </div>

          {/* Deals Badge */}
          {/* <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
            {destination.deals}
          </div> */}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
              {destination.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-200 mb-3 line-clamp-2">
              {destination.description}
            </p>
            
            {/* Explore Button */}
            {/* <div className="inline-flex items-center text-white font-semibold group-hover:text-yellow-400 transition-colors">
              <span className="text-sm sm:text-base">Explore</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div> */}
          </div>
        </div>
      {/* </Link> */}
    </article>
  )
}
