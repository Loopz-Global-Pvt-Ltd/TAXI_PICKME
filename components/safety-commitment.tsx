"use client"

import { motion } from "framer-motion"
import { Heart, AlertCircle, Users, Shield, Phone } from "lucide-react"

const COMMITMENTS = [
  {
    icon: Shield,
    title: "Vehicle Safety",
    description: "Regular maintenance and safety inspections of all vehicles",
  },
  {
    icon: Users,
    title: "Driver Standards",
    description: "Background checks and professional training for all drivers",
  },
  {
    icon: Phone,
    title: "24/7 Emergency Support",
    description: "Immediate assistance available anytime, anywhere",
  },
  {
    icon: AlertCircle,
    title: "Insurance Coverage",
    description: "Comprehensive insurance for all passengers and luggage",
  },
]

export default function SafetyCommitment() {
  return (
    <section className="py-16 md:py-24 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Safety is Our Priority</h2>
            <p className="text-lg text-gray-800 mb-8">
              We're committed to providing the safest and most professional transportation experience in Sri Lanka.
              Every vehicle, driver, and journey is protected by our comprehensive safety and insurance protocols.
            </p>

            <div className="space-y-4">
              {COMMITMENTS.map((commitment, index) => {
                const Icon = commitment.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start bg-white/40 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <Icon className="text-gray-900 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{commitment.title}</h3>
                      <p className="text-sm text-gray-700">{commitment.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900 p-8 rounded-xl border-2 border-gray-800 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">0</div>
                <p className="text-white font-semibold">Accident Rate</p>
                <p className="text-sm text-gray-300">Over 10,000+ safe journeys</p>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <p className="text-sm text-white mb-4">
                  <Heart className="inline text-yellow-400 mr-2" size={16} />
                  <span className="font-semibold">Trusted by International Travelers</span>
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

