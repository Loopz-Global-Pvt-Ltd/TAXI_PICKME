import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Taxi Sri Lanka</h3>
            <p className="text-sm opacity-80">Your trusted partner for reliable taxi services across Sri Lanka.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:opacity-80 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-80 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:opacity-80 transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-80 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +94 777 850 529
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                info@sritaxi.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Facebook size={20} className="hover:opacity-80 transition cursor-pointer" />
              <Instagram size={20} className="hover:opacity-80 transition cursor-pointer" />
              <Twitter size={20} className="hover:opacity-80 transition cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <p>&copy; 2025 Taxi Sri Lanka Tours. All rights reserved.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/terms" className="hover:opacity-80 transition">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:opacity-80 transition">
                Privacy Policy
              </Link>
            </div>
            {/* <p className="text-right">Made with ❤️ for Sri Lanka</p> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
