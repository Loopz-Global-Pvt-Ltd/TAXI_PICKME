"use client"

import { motion } from "framer-motion"
import { Award, Globe } from "lucide-react"

const PARTNERS = [
  { name: "Sri Lanka Tourism Board", category: "Official Partner" },
  { name: "Asian Hotel Federation", category: "Strategic Partner" },
  { name: "International Tourism Association", category: "Certified Member" },
  { name: "Global Safety Standards", category: "Compliance Partner" },
  { name: "Travel & Tourism Council", category: "Member" },
  { name: "Sri Lanka Business Forum", category: "Registered Member" },
]

export default function Partnerships() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-lg opacity-90">Recognized partnerships and certifications</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg p-6 backdrop-blur-sm border border-primary-foreground/10 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <Award className="text-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                  <p className="text-sm opacity-75">{partner.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm opacity-80 flex items-center justify-center gap-2">
            <Globe size={16} />
            Operating across Sri Lanka with international standards
          </p>
        </motion.div>
      </div>
    </section>
  )
}
