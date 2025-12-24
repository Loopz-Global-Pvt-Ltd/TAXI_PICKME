import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MapsProvider } from "@/components/providers/maps-provider"
import { HomeStructuredData } from '@/components/seo/HomeStructuredData'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Taxi Sri Lanka Tours | Airport Transfers, Tours, Cab & Car Hire with Driver",
    template: "%s | Taxi Sri Lanka Tours"
  },
  description: "Book reliable taxi service in Sri Lanka. Airport transfers from Colombo BIA, car hire with English-speaking driver, island-wide tours to Sigiriya, Kandy, Ella, Galle. 24/7 tourist transport with instant booking.",
  applicationName: "Taxi Sri Lanka Tours Tours",
  keywords: [
    // Core Services
    'Taxi Sri Lanka Tours',
    'sri lanka taxi booking',
    'cab service sri lanka',
    'private Taxi Sri Lanka Tours',
    'book taxi online sri lanka',
    'sri lanka taxi service',
    'colombo taxi',
    'sri lanka airport taxi',
    'bandaranaike airport transfer',
    'BIA airport taxi',
    'colombo airport transfer',


      // Tourist Destinations
      'colombo to kandy taxi',
      'colombo to ella taxi',
      'colombo to galle taxi',
      'colombo to sigiriya taxi',
      'colombo to nuwara eliya taxi',
      'airport to kandy taxi',
      'airport to ella transfer',
      'airport to sigiriya transfer',

    // Airport Transfers
    'sri lanka airport transfer',
    'colombo airport taxi',
    'bandaranaike airport transfer',
    'airport pickup sri lanka',
    'airport drop sri lanka',

    // Car & Driver
    'car hire with driver sri lanka',
    'private driver sri lanka',
    'chauffeur service sri lanka',
    'english speaking driver sri lanka',

    // Tourism Transport
    'sri lanka tourism transport',
    'tourist transport sri lanka',
    'sri lanka tours with driver',
    'custom sri lanka tours',

    // Three Wheel
    'three wheel booking sri lanka',
    'tuk tuk booking sri lanka',
    'tourist tuk tuk sri lanka',

    // Major Cities
    'colombo taxi service',
    'kandy taxi service',
    'galle taxi service',

    // Cultural Triangle
    'dambulla taxi service',
    'sigiriya taxi service',
    'polonnaruwa taxi service',

    // Beach Destinations
    'hikkaduwa taxi',
    'mirissa taxi service',
    'unawatuna taxi',
    'bentota taxi',
    'arugam bay taxi',
    'pasikuda taxi',
    'trincomalee taxi',

    // Hill Country
    'ella taxi service',
    'nuwara eliya taxi service',
    'haputale taxi service',

    // East Coast
    'arugam bay taxi service',
    'pasikuda taxi service',
    'trincomalee taxi service',

    // Safari
    'yala safari taxi',
    'udawalawa safari taxi',
    'minneriya safari transport',

    // Routes
    'airport to kandy taxi',
    'airport to galle taxi',
    'airport to ella taxi',
    'airport to sigiriya taxi',
    'colombo to hikkaduwa taxi',

    // Tour Packages
    'sri lanka tour packages with driver',
    'sri lanka private driver',
    'sri lanka chauffeur service',
    'sri lanka day tours',
    'sigiriya tour from colombo',
    'kandy day tour',
    'ella tour package',
    'yala safari taxi',
    'udawalawe safari transport',

    // Cultural Triangle
    'sigiriya taxi',
    'polonnaruwa taxi',
    'dambulla taxi',
    'anuradhapura taxi',
    'cultural triangle tour',

    // Booking Related
    'book taxi online sri lanka',
    'taxi booking sri lanka',
    'online cab booking sri lanka',
    '24/7 Taxi Sri Lanka Tours',
    'instant taxi booking',
        
  ],
  authors: [{ name: "Taxi Sri Lanka Tours Tours" , url: "https://taxisrilanka.com"  }],
  creator: 'Taxi Sri Lanka Tours',
  publisher: 'Taxi Sri Lanka Tours Tours',
    
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taxisrilanka.com',
    siteName: 'Taxi Sri Lanka Tours Tours',
    title:
      'Taxi Sri Lanka Tours – Tourist Taxi, Airport Transfers & Islandwide Tours',
    description: 'Sri Lanka\'s #1 rated taxi service. Book airport transfers, car hire with driver, and island-wide tours. English-speaking drivers, instant booking, 24/7 service.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Taxi Sri Lanka Tours - Tourist Transport & Airport Transfers',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: 'Taxi Sri Lanka Tours \'s Premier Taxi Service',
    description: 'Book reliable, affordable taxi services across Sri Lanka',
    images: ['/images/taxi-srilanak.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },


  alternates: {
    canonical: 'https://taxisrilanka.com',
    languages: {
      'en-US': 'https://taxisrilanka.com',
      'en-GB': 'https://taxisrilanka.com',
    },
  },

  verification: {
    google: 'VUv4RmrTeTNue1hfJyek3oq_0DQiVZiK3_pv8czY79g', 
    other: {
      'facebook-domain-verification': 'YOUR_FB_VERIFICATION_CODE', // Optional
    },
  },

  category: 'travel',
  
  other: {
    'google-site-verification': 'VUv4RmrTeTNue1hfJyek3oq_0DQiVZiK3_pv8czY79g',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO Tags */}
        <link rel="canonical" href="https://taxisrilanka.com" />
        <meta name="geo.region" content="LK" />
        <meta name="geo.placename" content="Sri Lanka" />
        <meta name="geo.position" content="7.8731;80.7718" />
        <meta name="ICBM" content="7.8731, 80.7718" />

         {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      <meta name="google-site-verification" content="VUv4RmrTeTNue1hfJyek3oq_0DQiVZiK3_pv8czY79g" />  
      <HomeStructuredData />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <MapsProvider>{children}</MapsProvider>
      </body>
    </html>
  )
}
