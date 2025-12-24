"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ChevronDown, Sparkles, ArrowRight, Star } from "lucide-react"
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
    <section className="py-6 sm:py-16 lg:py-10 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          {/* <div className="inline-flex items-center justify-center gap-2 mb-4 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg animate-pulse-slow">
            <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Discover Paradise
            </span>
            <Star className="h-4 w-4 text-white fill-white" />
          </div> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in-up">
            Explore Sri Lankan Destinations
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 animate-fade-in-up animation-delay-100">
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
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition-all hover:shadow-2xl hover:scale-105 group shadow-lg"
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
            <p className="text-sm text-gray-500 mt-3 animate-fade-in">
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
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform-gpu ${
        isVisible ? 'animate-slide-up-fade' : 'opacity-0'
      } ${isExpanding ? 'animate-scale-in' : ''}`}
      style={{
        animationDelay: `${(index % ITEMS_PER_LOAD) * 100}ms`
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-200">
        <Image
          src={destination.imageUrl}
          alt={`${destination.name} - ${destination.description}`}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={index < ITEMS_PER_LOAD ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB8h/9k="
        />
        
        {/* Animated Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:from-black/95" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Animated Border Shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-2xl animate-pulse-border" />
        </div>
        
        {/* Location Badge with Animation */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform group-hover:scale-110 group-hover:bg-yellow-400 transition-all duration-300 z-20">
          <MapPin className="h-3.5 w-3.5 text-red-500 group-hover:text-white transition-colors" />
          <span className="text-xs font-semibold text-gray-900 group-hover:text-white transition-colors">{destination.location}</span>
        </div>

        {/* Animated Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-[100px] transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 transform group-hover:translate-y-0 transition-all duration-500">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 transform group-hover:scale-105 group-hover:text-yellow-400 transition-all duration-300 drop-shadow-lg">
            {destination.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-200 mb-4 line-clamp-2 transform group-hover:translate-x-1 transition-all duration-300 drop-shadow-md">
            {destination.description}
          </p>
          
          {/* Animated Explore Button */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-sm border border-white/30 group-hover:bg-yellow-400 group-hover:text-gray-900 group-hover:border-yellow-400 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
            <span>Explore Now</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div> */}
        </div>

        {/* Hover Effect Lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
      </div>
    </article>
  )
}
