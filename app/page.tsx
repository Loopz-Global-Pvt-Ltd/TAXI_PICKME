import Header from "@/components/Header"
import Hero from "@/components/hero"
import TrustBadges from "@/components/trust-badges"
import Testimonials from "@/components/testimonials"
import WhyChooseUs from "@/components/why-choose-us"
import PopularRoutes from "@/components/popular-routes"
import FeaturedTours from "@/components/featured-tours"
import Statistics from "@/components/statistics"
import Partnerships from "@/components/partnerships"
import SafetyCommitment from "@/components/safety-commitment"
import Footer from "@/components/footer"
import WhatsAppButton from '@/components/WhatsAppButton';
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: {
    default:
      'Taxi Sri Lanka | Airport Transfers, Tours, Cab & Car Hire with Driver',
    template: '%s | Taxi Sri Lanka',
  },

  description:
    'Taxi Sri Lanka is the #1 tourist transport service offering airport transfers, taxi booking, cab services, car hire with driver, three-wheel bookings, and islandwide tours. Travel safely with English-speaking drivers, fixed pricing, and 24/7 support to destinations like Colombo, Kandy, Galle, Dambulla, Sigiriya, Ella, Hikkaduwa, Mirissa, Arugam Bay, and more.',

  keywords: [
    // Core
    'taxi sri lanka',
    'sri lanka taxi booking',
    'cab service sri lanka',
    'tourist taxi sri lanka',

    // Airport
    'sri lanka airport transfer',
    'colombo airport taxi',
    'bandaranaike airport transfer',
    'airport pickup sri lanka',

    // Driver & Car
    'car hire with driver sri lanka',
    'private driver sri lanka',
    'chauffeur service sri lanka',
    'english speaking driver sri lanka',

    // Tourism Transport
    'sri lanka tourism transport',
    'tourist transport sri lanka',
    'sri lanka tours with driver',
    'custom sri lanka tours',

    // Popular Destinations
    'kandy taxi service',
    'galle taxi service',
    'dambulla taxi service',
    'sigiriya taxi service',
    'ella taxi service',
    'hikkaduwa taxi service',
    'mirissa taxi service',
    'arugam bay taxi service',

    // Routes
    'airport to kandy taxi',
    'airport to galle taxi',
    'airport to sigiriya taxi',
    'airport to ella taxi',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taxisrilanka.com',
    siteName: 'Taxi Sri Lanka',
    title:
      'Taxi Sri Lanka – Airport Transfers, Tours & Tourist Transport',
    description:
      'Book trusted taxi services, airport transfers, car hire with driver, and islandwide tours in Sri Lanka. Serving tourists with safe, reliable transport and professional English-speaking drivers.',
    images: [
      {
        url: '/images/hero-taxi.jpg',
        width: 1200,
        height: 630,
        alt: 'Taxi Sri Lanka - Tourist Transport & Airport Transfers',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Taxi Sri Lanka | Tourist Taxi & Airport Transfers',
    description:
      'Reliable taxi booking, airport transfers, and tourist transport across Sri Lanka.',
    images: ['/images/hero-taxi.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://taxisrilanka.com',
  },
}
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrustBadges />
      {/* <FeaturedTours /> */}
      <Testimonials />
      <WhyChooseUs />
      {/* <PopularRoutes /> */}
      <SafetyCommitment />
      {/* <Partnerships /> */}
      <Statistics />
      <Footer />
      <WhatsAppButton 
          phoneNumber="94777850529" // Replace with your actual WhatsApp number
          message="Hello! I'm interested in learning more about DD Academy Could you please provide more information?"
          position="bottom-right"
          showTooltip={true}
        />
    </main>
  )
}
