"use client"

import { Car, Users, Shield, Clock, MapPin, CreditCard, CheckCircle2, Sparkles, Award } from "lucide-react"
import { motion } from "framer-motion"

const REASONS = [
  // {
  //   icon: CreditCard,
  //   title: "Transparent Pricing",
  //   description: "No hidden fees. See the full price before you book with instant fare calculation.",
  //   color: "from-blue-500 to-blue-600",
  //   bgColor: "bg-blue-50",
  //   iconColor: "text-blue-600",
  //   highlight: "Instant Quotes",
  // },
  // {
  //   icon: Car,
  //   title: "Professional Drivers",
  //   description: "Licensed, experienced drivers who know every corner of Sri Lanka.",
  //   color: "from-green-500 to-green-600",
  //   bgColor: "bg-green-50",
  //   iconColor: "text-green-600",
  //   highlight: "Verified Experts",
  // },
  // {
  //   icon: Shield,
  //   title: "Clean, Modern Vehicles",
  //   description: "Well-maintained cars with AC, WiFi, and premium comfortable seating.",
  //   color: "from-purple-500 to-purple-600",
  //   bgColor: "bg-purple-50",
  //   iconColor: "text-purple-600",
  //   highlight: "Premium Fleet",
  // },
  {
    icon: Users,
    title: "Flexible Booking",
    description: "Book for any duration - hourly, daily, or customized multi-day tours.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    highlight: "Your Schedule",
  },
  {
    icon: MapPin,
    title: "Tourist-Friendly Service",
    description: "Multilingual drivers with expert knowledge of attractions and hidden gems.",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    highlight: "Local Expertise",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service in multiple languages for your convenience.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
    highlight: "Always Available",
  },
]

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed opacity-30"
        style={{ backgroundImage: "url('/images/TaxiPickme-Why-choose-us.webp')" }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-black"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-yellow-400/30"
          >
            <Award className="text-yellow-400" size={24} />
            <span className="font-bold text-yellow-400">Award Winning Service</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Why Choose <span className="text-yellow-400">TaxiPickMe</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            We're committed to making your journey comfortable, safe, and unforgettable with premium service every mile
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {REASONS.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:border-yellow-400/50 transition-all h-full">
                  {/* Top Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${reason.color} text-white shadow-lg`}>
                      {reason.highlight}
                    </div>
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`${reason.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all`}
                  >
                    <Icon className={`${reason.iconColor}`} size={32} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {reason.description}
                  </p>

                  {/* Bottom Indicator */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${reason.color} rounded-full`}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />

                  {/* Checkmark on Hover */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center shadow-lg`}>
                      <CheckCircle2 className="text-white" size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-yellow-300">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="text-gray-900" size={32} />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Experience the Difference Today
              </h3>
              <Sparkles className="text-gray-900" size={32} />
            </div>
            <p className="text-gray-800 text-lg mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of satisfied travelers who chose quality, comfort, and reliability
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const searchForm = document.getElementById('search-form-section')
                  if (searchForm) {
                    searchForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                <CheckCircle2 className="inline mr-2" size={20} />
                Book Your Ride Now
              </motion.button>
              <motion.a
                href="tel:+94777850529"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all"
              >
                <Clock className="inline mr-2" size={20} />
                Call: +94 777 850 529
              </motion.a>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
