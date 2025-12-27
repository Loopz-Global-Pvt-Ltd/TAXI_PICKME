import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Taxi Sri Lanka Tours</h3>
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
                sritaxi@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex items-center gap-4">
              <a
              href="https://www.facebook.com/taxisrilanka.com.tours/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Taxi Sri Lanka Tours on Facebook - opens in new tab"
              className="flex items-center gap-2 hover:opacity-80 transition"
              >
              <Facebook size={20} className="cursor-pointer" />
              <span className="text-sm">Like us on Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <p>&copy; 2025 Taxi Sri Lanka Tours. All rights reserved.</p>
                  {/* Developed by badge (bottom-right) */}
        <div className=" z-50">
          <a
            href="https://loopzglobal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            aria-label="Developed by Loopz Global - opens in new tab"
          >
            {/* Place logo at /public/images/loopz-logo.png */}
   
            <div className="text-xs leading-tight">
              <div className="text-[10px] opacity-80">Developed by</div>
              <div className="text-[12px] font-semibold">Loopz Global</div>
            </div>
          </a>
        </div>
          </div>
        </div>
      </div>


    </footer>
  )
}
