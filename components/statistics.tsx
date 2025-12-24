"use client"

import { Users, MapPin, Star, Clock } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const STATS = [
  {
    icon: Users,
    number: 500,
    label: "Happy Customers",
    suffix: "+",
  },
  {
    icon: MapPin,
    number: 50,
    label: "Destinations",
    suffix: "+",
  },
  {
    icon: Star,
    number: 100,
    label: "Professional Drivers",
    suffix: "+",
  },
  {
    icon: Clock,
    number: 24,
    label: "24/7 Availability",
    suffix: "/7",
  },
]

function AnimatedCounter({ from = 0, to, duration = 2 }) {
  const [count, setCount] = useState(from)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let currentCount = from
    const increment = (to - from) / (duration * 60)
    const interval = setInterval(() => {
      currentCount += increment
      if (currentCount >= to) {
        setCount(to)
        clearInterval(interval)
      } else {
        setCount(Math.floor(currentCount))
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [isVisible, from, to, duration])

  return <span ref={ref}>{count}</span>
}

export default function Statistics() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const statVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-10 md:py-25 bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <motion.div ref={sectionRef} style={{ scale }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">By The Numbers</h2>
            <p className="text-lg opacity-90">Trusted by thousands of travelers worldwide</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {STATS.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  variants={statVariants}
                  whileHover={{
                    scale: 1.08,
                  }}
                  className="text-center p-3 md:p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 transition-all cursor-pointer prefers-reduced-motion:hover:scale-100"
                >
                  <motion.div
                    className="flex justify-center mb-2"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={40} className="opacity-90" />
                  </motion.div>
                  <p className="text-4xl md:text-5xl font-bold mb-2">
                    <AnimatedCounter to={stat.number} duration={2.5} />
                    {stat.suffix}
                  </p>
                  <p className="text-sm md:text-base opacity-80">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
