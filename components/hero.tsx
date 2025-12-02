"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Shield, Clock, MapPin } from "lucide-react"
import SearchForm from "./search-form"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const slides = [
    {
      image: "/images/TaxiPickme-Slider-1.jpg",
      title: "Sri Lanka's Premier Taxi Service",
      subtitle: "Professional Drivers • Luxury Comfort • Unbeatable Rates",
      highlight: "Book Now & Save 15%",
    },
    {
      image: "/images/TaxiPickme-Slider-4.webp",
      title: "Explore Sri Lanka In Style",
      subtitle: "Island-Wide Coverage • 24/7 Availability • Licensed & Insured",
      highlight: "Trusted by 10,000+ Travelers",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  }

  const overlayVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
              }}
            />
            {/* Gradient Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none">
        <motion.button
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="text-white" size={24} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next slide"
        >
          <ChevronRight className="text-white" size={24} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Top Section - Hero Text */}
        <div className="flex-1 flex items-center px-4 pt-6 pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl"
              >
                {/* Highlight Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-6"
                >
                  <Star className="fill-current" size={16} />
                  {slides[currentSlide].highlight}
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl text-gray-200 mb-8"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-4 items-center"
                >
                  <div className="flex items-center gap-2 text-white">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="fill-yellow-400 text-yellow-400" size={18} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.9/5 Rating</span>
                  </div>
                  <div className="h-6 w-px bg-white/30" />
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Shield size={18} />
                    <span>Fully Insured</span>
                  </div>
                  <div className="h-6 w-px bg-white/30" />
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Clock size={18} />
                    <span>24/7 Service</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Middle Section - Search Form */}
        <div id="search-form-section" className="px-4 pb-8 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-8 border-2 border-yellow-400">
              <div className="mb-4">
                <p className="text-gray-900 text-xl md:text-2xl font-bold">
                  Book Your Ride Now
                </p>
              </div>
              <SearchForm />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Features */}
        <div className="px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, text: "Licensed & Verified Drivers", color: "yellow" },
                { icon: Clock, text: "Punctual & Reliable Service", color: "blue" },
                { icon: Star, text: "Top-Rated Experience", color: "green" },
                { icon: MapPin, text: "Island-Wide Coverage", color: "red" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <feature.icon className="text-yellow-500 mx-auto mb-2" size={32} />
                  <p className="text-white text-sm font-medium leading-tight">
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1)
                setCurrentSlide(index)
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "bg-yellow-400 w-8" 
                  : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}