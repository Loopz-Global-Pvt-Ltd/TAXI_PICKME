"use client"

import Link from "next/link"
import { Menu, X, Car, Phone, Mail, Star, Shield , BookCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSearchForm = () => {
    const searchForm = document.getElementById('search-form-section')
    if (searchForm) {
      searchForm.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
    setIsOpen(false) // Close mobile menu after clicking
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className="hidden md:block bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center gap-6">
              <motion.a
                href="tel:+94 777 850 529"
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone size={14} />
                <span>+94 777 850 529</span>
              </motion.a>
              <motion.a
                href="mailto:info@taxipickme.com"
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail size={14} />
                <span>info@taxipickme.com</span>
              </motion.a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="fill-current" size={14} />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <span>Licensed & Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 border-b-2 border-yellow-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isScrolled
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                    : "bg-gray-900"
                }`}
              >
                <Car className="text-white" size={24} />
              </motion.div>
              <div className="hidden sm:block">
                <h1
                  className={`font-bold text-2xl transition-colors ${
                    isScrolled ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  TaxiPickMe
                </h1>
                <p
                  className={`text-xs font-medium ${
                    isScrolled ? "text-gray-600" : "text-gray-800"
                  }`}
                >
                  Your Premium Ride Partner
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all relative group ${
                      isScrolled
                        ? "text-gray-700 hover:text-gray-900 hover:bg-yellow-50"
                        : "text-gray-900 hover:text-white hover:bg-gray-900/10"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        isScrolled ? "bg-yellow-500" : "bg-gray-900"
                      }`}
                    ></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                onClick={scrollToSearchForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                  isScrolled
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-xl"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <BookCheck className="inline mr-2" size={18} />
                Book Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-gray-900 hover:bg-gray-900/10"
              }`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden border-t border-gray-200"
              >
                <div className="py-4 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                          isScrolled
                            ? "text-gray-700 hover:bg-yellow-50 hover:text-gray-900"
                            : "text-gray-900 hover:bg-gray-900/10"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Contact Info */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    <a
                      href="tel:+94 777 850 529"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isScrolled
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-900 hover:bg-gray-900/10"
                      }`}
                    >
                      <Phone size={18} />
                      <span className="font-medium">+94 777 850 529</span>
                    </a>
                    <a
                      href="mailto:info@taxipickme.com"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isScrolled
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-900 hover:bg-gray-900/10"
                      }`}
                    >
                      <Mail size={18} />
                      <span className="font-medium">info@taxipickme.com</span>
                    </a>
                  </div>

                  {/* Mobile CTA */}
                  <motion.button
                    onClick={scrollToSearchForm}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full mx-4 mt-4 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold text-center rounded-xl shadow-lg"
                  >
                    <BookCheck className="inline mr-2" size={18} />
                    Book Your Ride Now
                  </motion.button>

                  {/* Mobile Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="fill-current" size={14} />
                      <span className="font-semibold">4.9/5</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Shield size={14} />
                      <span className="font-medium">Licensed</span>
                    </div>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  )
}
