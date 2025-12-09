"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

const ROUTES = [
  {
    id: 1,
    from: "Colombo Airport",
    to: "Galle",
    image: "/scenic-road-to-galle-sri-lanka-beaches.jpg",
    distance: "145 km",
    price: "Rs 3,500",
  },
  {
    id: 2,
    from: "Colombo",
    to: "Kandy",
    image: "/kandy-cultural-triangle-temple-sri-lanka.jpg",
    distance: "115 km",
    price: "Rs 2,800",
  },
  {
    id: 3,
    from: "Negombo",
    to: "Sigiriya",
    image: "/sigiriya-rock-fortress-sri-lanka-landscape.jpg",
    distance: "180 km",
    price: "Rs 4,200",
  },
  {
    id: 4,
    from: "Airport",
    to: "Nuwara Eliya",
    image: "/nuwara-eliya-tea-plantations-mountains-sri-lanka.jpg",
    distance: "200 km",
    price: "Rs 4,800",
  },
]

export default function PopularRoutes() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Routes</h2>
          <p className="text-lg text-muted-foreground">Explore our most requested destinations in Sri Lanka</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {ROUTES.map((route) => (
            <motion.div key={route.id} variants={cardVariants} whileHover={{ y: -8 }}>
              <Link href={`/search?pickup=${route.from}&dropoff=${route.to}`}>
                <div className="relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer h-full flex flex-col group prefers-reduced-motion:hover:y-0">
                  <motion.div style={{ y: imageY }} className="relative h-40 bg-cover bg-center overflow-hidden">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </motion.div>

                  <div className="p-4 flex-1 flex flex-col relative z-10">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors"
                    >
                      {route.from}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      viewport={{ once: true }}
                      className="text-sm text-muted-foreground mb-3 flex items-center gap-2"
                    >
                      <span>→ {route.to}</span>
                      <ArrowRight size={14} className="opacity-50" />
                    </motion.p>
                    <div className="mt-auto pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">{route.distance}</p>
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-lg font-bold text-secondary"
                      >
                        {route.price}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
