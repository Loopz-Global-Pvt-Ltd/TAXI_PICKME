"use client"

import { Star } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "USA",
    rating: 5,
    text: "Excellent service! The driver was professional and took the most scenic route. Highly recommend for airport transfers.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Singapore",
    rating: 5,
    text: "Very punctual and clean vehicles. The booking process was seamless and the pricing was transparent.",
    date: "1 month ago",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Williams",
    country: "Australia",
    rating: 5,
    text: "Amazing experience exploring Sri Lanka! The driver knew all the best spots and was very friendly.",
    date: "3 weeks ago",
    verified: true,
  },
]

export default function Testimonials() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section ref={sectionRef} className="relative py-10 md:py-22 overflow-hidden">
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/15 via-transparent to-secondary/15" />
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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-2">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="prefers-reduced-motion:transition-none"
              >
                <Star size={24} className="fill-secondary text-secondary" />
              </motion.div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground">4.8 out of 5 based on 500+ verified reviews</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(250, 204, 21, 0.15)" }}
              className="relative bg-card/80 backdrop-blur-sm border border-secondary/30 rounded-xl p-4 transition-all cursor-pointer prefers-reduced-motion:hover:y-0"
            >
              {testimonial.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                  className="absolute top-4 right-4 w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                >
                  <span className="text-black text-xs font-bold">✓</span>
                </motion.div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                </div>
                <span className="text-xs text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                  {testimonial.date}
                </span>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 + idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Star size={18} className="fill-secondary text-secondary" />
                  </motion.div>
                ))}
              </div>

              <p className="text-foreground leading-relaxed italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
