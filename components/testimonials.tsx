"use client"

import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "USA",
    avatar: "/avatars/avatar1.jpg",
    rating: 5,
    text: "Excellent service! The driver was professional and took the most scenic route. Highly recommend for airport transfers. The vehicle was clean and comfortable.",
    date: "2 weeks ago",
    verified: true,
    platform: "Google Reviews",
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Singapore",
    avatar: "/avatars/avatar2.jpg",
    rating: 5,
    text: "Very punctual and clean vehicles. The booking process was seamless and the pricing was transparent. Our driver was knowledgeable about local attractions.",
    date: "1 month ago",
    verified: true,
    platform: "TripAdvisor",
  },
  {
    id: 3,
    name: "Emma Williams",
    country: "Australia",
    avatar: "/avatars/avatar3.jpg",
    rating: 5,
    text: "Amazing experience exploring Sri Lanka! The driver knew all the best spots and was very friendly. Made our vacation truly memorable.",
    date: "3 weeks ago",
    verified: true,
    platform: "Google Reviews",
  },
  {
    id: 4,
    name: "David Kumar",
    country: "India",
    avatar: "/avatars/avatar4.jpg",
    rating: 5,
    text: "Best taxi service in Sri Lanka! Professional drivers, comfortable cars, and great customer service. Will definitely use again on my next visit.",
    date: "5 days ago",
    verified: true,
    platform: "Google Reviews",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    country: "UK",
    avatar: "/avatars/avatar5.jpg",
    rating: 5,
    text: "Fantastic service from start to finish. The driver was waiting at the airport with a name board. Very professional and courteous throughout the journey.",
    date: "2 months ago",
    verified: true,
    platform: "Booking.com",
  },
]

const STATS = [
  { label: "Total Reviews", value: "1,000+" },
  { label: "Average Rating", value: "4.9/5" },
  { label: "5-Star Reviews", value: "95%" },
  { label: "Verified Customers", value: "98%" },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
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

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full mb-6"
          >
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-bold text-gray-900">Verified Reviews</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Our <span className="text-yellow-500">Customers</span> Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don't just take our word for it - hear from travelers who've experienced our service
          </p>

          {/* Rating Display */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Star size={32} className="fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            4.9 out of 5
            <span className="text-lg font-normal text-gray-600 ml-2">
              based on 1000+ verified reviews
            </span>
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-yellow-400/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative">
          {/* Main Slider Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-4 md:p-10 border-4 border-yellow-400 overflow-hidden min-h-[250px]">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote size={120} className="text-yellow-400" />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                className="relative z-10"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Avatar Section */}
                  {/* <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1">
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600">
                          {TESTIMONIALS[currentIndex].name.charAt(0)}
                        </div>
                      </div>
                      {TESTIMONIALS[currentIndex].verified && (
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <CheckCircle className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Content Section */}
                  <div className="flex-1 text-center px-13 md:text-left">
                    {/* Stars */}
                    <div className="flex justify-center md:justify-start gap-1 mb-2">
                      {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                        <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-3 italic">
                      "{TESTIMONIALS[currentIndex].text}"
                    </p>

                    {/* Author Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">
                          {TESTIMONIALS[currentIndex].name}
                        </h4>
                        <p className="text-gray-600">
                          {TESTIMONIALS[currentIndex].country}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm text-gray-500">
                          {TESTIMONIALS[currentIndex].date}
                        </span>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-blue-600">
                            {TESTIMONIALS[currentIndex].platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {/* <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
              <motion.button
                onClick={handlePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-xl border-2 border-yellow-400 flex items-center justify-center hover:bg-yellow-50 transition-all"
              >
                <ChevronLeft className="text-gray-900" size={28} />
              </motion.button>
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-white shadow-xl border-2 border-yellow-400 flex items-center justify-center hover:bg-yellow-50 transition-all"
              >
                <ChevronRight className="text-gray-900" size={28} />
              </motion.button>
            </div> */}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                whileHover={{ scale: 1.2 }}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-yellow-400 w-12"
                    : "bg-gray-300 w-3 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              See All Our Reviews on Google
            </h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and read authentic reviews from real travelers
            </p>
            <motion.a
              href="#" // Replace with actual Google Reviews link
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              View Google Reviews
              <ExternalLink size={20} />
            </motion.a>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
