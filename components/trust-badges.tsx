"use client"

import { Shield, Award, MapPin, Users, Zap, Leaf, Star, ThumbsUp, Clock, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const BADGES = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "All vehicles fully licensed and insured",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    stat: "100%",
    statLabel: "Coverage",
  },
  {
    icon: Award,
    title: "Top Rated",
    description: "4.9★ rating from 1000+ reviews",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    stat: "4.9/5",
    statLabel: "Rating",
  },
  {
    icon: Users,
    title: "Professional Drivers",
    description: "150+ trained & verified drivers",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "Green Fleet",
    stat: "150+",
    statLabel: "Drivers",
  }
]

const ACHIEVEMENTS = [
  { value: "1000+", label: "Happy Customers" },
  { value: "100+", label: "Daily Rides" },
  { value: "10+", label: "Years Experience" },
  { value: "98%", label: "On-Time Rate" },
]

export default function TrustBadges() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="relative py-10 md:py-15 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg"
          >
            <CheckCircle2 className="text-green-600" size={24} />
            <span className="font-bold text-gray-900">Trusted by Thousands</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Why Choose <span className="text-white">TaxiPickMe</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto">
            Your safety, comfort, and satisfaction are our top priorities
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {ACHIEVEMENTS.map((achievement, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border-2 border-white/50"
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {achievement.value}
              </div>
              <div className="text-sm md:text-base text-gray-700 font-semibold">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Badges Grid */}
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {BADGES.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-white/50 hover:shadow-2xl transition-all h-full">
               
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${badge.bgColor} p-4 rounded-xl shadow-md`}>
                      <Icon className={`${badge.iconColor}`} size={32} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                        {badge.stat}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        {badge.statLabel}
                      </div>
                    </div>
                  </div>

             
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {badge.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {badge.description}
                  </p>

           
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div> */}

        {/* Bottom CTA Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white/50 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join 10,000+ Satisfied Travelers
            </h3>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              Experience the difference of professional service, comfort, and reliability with Sri Lanka's most trusted taxi service.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                Book Your Ride Now
              </motion.button>
              <motion.a
                href="tel:+94 777 850 529"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all"
              >
                Call: +94 123 456 789
              </motion.a>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
