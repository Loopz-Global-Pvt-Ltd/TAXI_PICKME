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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Your Safety is Our Priority</h2>
            <p className="text-lg text-muted-foreground mb-8">
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
                    className="flex gap-4 items-start"
                  >
                    <Icon className="text-secondary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-foreground">{commitment.title}</h3>
                      <p className="text-sm text-muted-foreground">{commitment.description}</p>
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
            className="bg-gradient-to-br from-secondary/20 to-secondary/5 p-8 rounded-xl border border-secondary/20"
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-secondary mb-2">0</div>
                <p className="text-foreground font-semibold">Accident Rate</p>
                <p className="text-sm text-muted-foreground">Over 10,000+ safe journeys</p>
              </div>
              <div className="border-t border-secondary/20 pt-6">
                <p className="text-sm text-foreground mb-4">
                  <Heart className="inline text-secondary mr-2" size={16} />
                  <span className="font-semibold">Trusted by International Travelers</span>
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-2 h-2 bg-secondary rounded-full" />
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
