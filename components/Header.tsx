"use client"

import Link from "next/link"
import { Menu, X , Car} from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-yellow-400 border-b border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-17">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-black hidden sm:inline">TaxiPickMe</span>
          </Link>

          <nav className="hidden md:flex gap-10">
            <Link href="/" className="text-black font-bold hover:text-black transition">
              Home
            </Link>
            <Link href="/destinations" className="text-black font-bold hover:text-black transition">
              Destinations
            </Link>
            <Link href="/about" className="text-black font-bold hover:text-black transition">
              About Us
            </Link>
            <Link href="/faq" className="text-black font-bold hover:text-black transition">
              FAQ
            </Link>
            <Link href="/contact" className="text-black font-bold hover:text-black transition">
              Contact
            </Link>
          </nav>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-black">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-5">
            <Link href="/" className="text-gray-300 hover:text-black transition">
              Home
            </Link>
            <Link href="/destinations" className="text-gray-300 hover:text-black transition">
              Destinations
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-black transition">
              About Us
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-black transition">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-black transition">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
