"use client"

import { Shield, Award, MapPin, Users, Zap, Leaf } from "lucide-react"
import { motion } from "framer-motion"

const BADGES = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "All vehicles fully licensed and insured",
    color: "text-yellow-600",
  },
  {
    icon: Award,
    title: "Top Rated",
    description: "4.8★ rating from 500+ verified reviews",
    color: "text-yellow-600",
  },
  {
    icon: Zap,
    title: "Professional Drivers",
    description: "100+ trained & background-checked drivers",
    color: "text-yellow-600",
  },
  {
    icon: MapPin,
    title: "Expert Local Knowledge",
    description: "Deep expertise in Sri Lanka tourism",
    color: "text-yellow-600",
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Dedicated customer support team",
    color: "text-yellow-600",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description: "Committed to sustainable tourism",
    color: "text-yellow-600",
  },
]

export default function TrustBadges() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-yellow-400 via-amber-200 to-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-4xl font-bold mb-2 text-gray-900">Why Trust Sri Lanka Taxi Service</h3>
          <p className="text-gray-600">Certified, professional, and customer-first</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center p-4 rounded-lg bg-white shadow-md hover:shadow-xl transition-all border border-yellow-200"
              >
                <Icon className={`${badge.color} mx-auto mb-2`} size={28} />
                <p className=" font-semibold mb-1 text-gray-800">{badge.title}</p>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
