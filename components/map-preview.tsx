"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

export default function MapPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full h-full bg-white/10 backdrop-blur rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden"
    >
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Map Preview</p>
          <p className="text-gray-300 text-sm mt-2">Route will display here</p>
        </div>
      </div>
    </motion.div>
  )
}
