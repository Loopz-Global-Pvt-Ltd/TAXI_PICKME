"use client"

import { Star, CheckCircle, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

interface TripAdvisorReview {
  reviewer_profile?: string
  reviewer_name: string
  reviewer_link: string
  review_title: string
  review_link: string
  review_id: string
  review_text: string
  review_exp: string
  review_date: string
  review_stars: string
  review_helpful: string
}

interface TripAdvisorData {
  bio: {
    name: string
    image: string
    link: string
    review_count: string
  }
  reviews: TripAdvisorReview[]
}

const STATS = [
  { label: "Total Reviews", value: "66+" },
  { label: "Average Rating", value: "4.8/5" },
  { label: "5-Star Reviews", value: "95%" },
  { label: "Verified", value: "100%" },
]

export default function Testimonials() {
  const [data, setData] = useState<TripAdvisorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(6) // Show 6 by default (2 rows × 3 cards)

  useEffect(() => {
    fetch('/tripadvisor.json')
      .then(res => res.json())
      .then((jsonData: TripAdvisorData) => {
        setData(jsonData)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading reviews:', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section className="relative py-5 md:py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </section>
    )
  }

  if (!data || data.reviews.length === 0) {
    return null
  }

  const displayedReviews = data.reviews.slice(0, displayCount)

  return (
    <section className="relative py-8 md:py-10 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with TripAdvisor Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* TripAdvisor Logo Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Image
                src="/images/Taxi Sri Lanka Tours Tripadvisor.png"
                alt="TripAdvisor Top Rated"
                width={200}
                height={200}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full mb-6 border-2 border-green-200"
          >
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-bold text-green-900">Verified TripAdvisor Reviews</span>
          </motion.div> */}

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Our <span className="text-green-600">Travelers</span> Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Reviews From Travelers On TripAdvisor
          </p>
          {/* <p className="text-2xl font-bold text-green-600">
            {data.bio.review_count} Verified Reviews
          </p> */}

          {/* Rating Display */}
          {/* <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                <Star size={32} className="fill-green-600 text-green-600" />
              </motion.div>
            ))}
          </div> */}
        </motion.div>

        {/* Reviews Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.review_id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-400 hover:shadow-xl transition-all duration-300"
            >
              {/* TripAdvisor Icon on Card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(parseInt(review.review_stars))].map((_, i) => (
                    <Star key={i} size={16} className="fill-green-600 text-green-600" />
                  ))}
                </div>
                <Image
                  src="/images/Taxi Sri Lanka Tours Tripadvisor.png"
                  alt="TripAdvisor"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain opacity-60"
                />
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 mb-4">
                {review.reviewer_profile ? (
                  <Image
                    src={review.reviewer_profile}
                    alt={review.reviewer_name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{review.reviewer_name}</h4>
                  <p className="text-xs text-gray-500">{review.review_date}</p>
                </div>
              </div>

              {/* Review Title */}
              <h5 className="font-bold text-gray-900 mb-2 line-clamp-1">
                {review.review_title}
              </h5>

              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {review.review_text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {data.reviews.length > displayCount && (
          <div className="text-center mb-8">
            <motion.button
              onClick={() => setDisplayCount(prev => Math.min(prev + 6, data.reviews.length))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              Load More Reviews ({data.reviews.length - displayCount} remaining)
            </motion.button>
          </div>
        )}

        {/* TripAdvisor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Read More Reviews on TripAdvisor
              </h3>
              <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                See what other travelers say about their experience with Taxi Sri Lanka Tours
              </p>
              <motion.a
                href={data.bio.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                <Image
                  src="/images/Taxi Sri Lanka Tours Tripadvisor.png"
                  alt="TripAdvisor"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                View All TripAdvisor Reviews
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
