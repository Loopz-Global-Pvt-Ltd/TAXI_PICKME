"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SearchForm from "./search-form"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [preloadedImages, setPreloadedImages] = useState<{ [key: number]: boolean }>({})

  const slides = [
    {
      image: "/images/TaxiPickme-Slider-1.png",
      title: "Taxi Pickme Service",
      subtitle: "Your Trusted Transportation Partner Across Sri Lanka",
    },
    {
      image: "/images/TaxiPickme-Slider-2.jpg",
      title: "Sri Lanka Tourism",
      subtitle: "Explore Paradise with Professional Local Drivers",
    },
    {
      image: "/images/TaxiPickme-Slider-3.png",
      title: "Adventure Awaits",
      subtitle: "Book Now and Discover Sri Lanka's Hidden Gems",
    },
    {
      image: "/images/TaxiPickme-Slider-4.png",
      title: "Coastal Wonders",
      subtitle: "Experience the Beauty of Island Life",
    },
  ]

  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new window.Image()
      img.onload = () => {
        setPreloadedImages((prev) => ({ ...prev, [index]: true }))
      }
      img.src = slide.image
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] as const },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <section className="relative min-h-screen p-5 overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={`bg-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ scale: 1.1 }}
            animate={{ 
              scale: index === currentSlide ? [1.1, 1] : 1.1 
            }}
            transition={{ 
              duration: 5,
              ease: "easeInOut"
            }}
          >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 5 }}
        ></motion.div>
      </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-between px-4 min-h-screen py-20">
        {/* Top section - Title and Subtitle */}
        {/* <div className="flex-1 flex flex-col items-center justify-center"> */}
          {/* <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 z-10 text-center"
          >
            <motion.div
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 text-balance">
                {slides[currentSlide].title}
              </motion.h1>
              <motion.div className="w-24 h-1 bg-yellow-400 mx-auto mb-4 rounded-full"></motion.div>
            </motion.div> */}

            {/* <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-100 text-balance"
            >
              {slides[currentSlide].subtitle}
            </motion.p> */}
          {/* </motion.div> */}
        {/* </div> */}

        {/* Middle section - Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 160 }}
          animate={{ opacity: 1, y: 130 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 flex items-center justify-center w-full max-w-5xl z-10"
        >
            <div className="w-full bg-white/70 overflow-hidden backdrop-blur  rounded-2xl shadow-2xl p-5 md:p-5 border-6 border-yellow-400">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 p-3">Find Your Ride</h2>
            <SearchForm />
            </div>
        </motion.div>

        {/* Bottom section - Badges and Controls */}
        <div className="flex-1 flex flex-col items-center mt-1 justify-end gap-8 w-full">
          <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
            {["✓ Professional Drivers", "✓ 24/7 Support", "✓ Best Rates", "✓ Safe Travel"].map((badge, index) => (
              <motion.div
                key={index}
                variants={badgeVariants}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 bg-yellow-400/20 backdrop-blur border border-yellow-400/50 px-4 py-2 rounded-lg hover:bg-yellow-400/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm text-yellow-300 font-medium">{badge}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Controls */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-20"> */}
            {/* <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-colors shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-colors shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </motion.button> */}
          {/* </div> */}

          <div className="absolute bottom-6 right-6 flex gap-2 z-20">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-yellow-400 w-8" : "bg-white/50 w-3 hover:bg-white/70"
                }`}
                whileHover={{ scale: 1.2 }}
                aria-label={`Go to slide ${index + 1}`}
              ></motion.button>
            ))}
          </div>


        </div>
      </div>
    </section>
  )
}
