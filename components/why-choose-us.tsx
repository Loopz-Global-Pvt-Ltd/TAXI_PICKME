"use client"

import { Car, Users, Shield, Clock, MapPin, CreditCard } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const REASONS = [
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "No hidden fees. See the full price before you book.",
  },
  {
    icon: Car,
    title: "Professional Drivers",
    description: "Licensed, experienced drivers who know Sri Lanka well.",
  },
  {
    icon: Shield,
    title: "Clean, Modern Vehicles",
    description: "Well-maintained cars with AC, WiFi, and comfortable seating.",
  },
  {
    icon: Users,
    title: "Flexible Booking",
    description: "Book for any duration - hourly, daily, or multi-day tours.",
  },
  {
    icon: MapPin,
    title: "Tourist-Friendly Service",
    description: "Multilingual drivers and advice on attractions.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service in multiple languages.",
  },
]

export default function WhyChooseUs() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  })

  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.8])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/sri-taxi-background-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <motion.div style={{ opacity: backgroundOpacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/20 blur-3xl" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-1 w-16 bg-secondary mx-auto mb-6 rounded-full"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Taxi Pickme?</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We're committed to making your journey comfortable, safe, and memorable
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {REASONS.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px -10px rgba(250, 204, 21, 0.2)",
                  y: -8,
                }}
                className="relative bg-white/90 backdrop-blur-md rounded-xl p-8 border border-secondary/30 transition-all cursor-pointer prefers-reduced-motion:hover:scale-100"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-secondary/10 rounded-bl-xl" />

                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 transition-all"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon size={28} className="text-primary" />
                </motion.div>

                <h3 className="text-lg font-semibold text-foreground mb-3">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-secondary via-secondary to-transparent rounded-full"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
