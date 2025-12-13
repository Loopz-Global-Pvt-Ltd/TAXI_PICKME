import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MapsProvider } from "@/components/providers/maps-provider"
import { HomeStructuredData } from '@/components/seo/HomeStructuredData'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default:
      'Taxi Sri Lanka | Airport Transfers, Tours, Cab, Car & Driver Services',
    template: '%s | Taxi Sri Lanka',
  }, 
  description: 'Taxi Sri Lanka offers trusted taxi booking, airport transfers, car hire with driver, cab and three-wheel services across Sri Lanka. We provide tourist-friendly transport to top destinations including Colombo, Kandy, Galle, Dambulla, Sigiriya, Hikkaduwa, Mirissa, Ella, Nuwara Eliya, Arugam Bay, Yala, and more with English-speaking drivers and fixed pricing.',

  keywords: [
    // Core Services
    'taxi sri lanka',
    'sri lanka taxi booking',
    'cab service sri lanka',
    'private taxi sri lanka',
    'book taxi online sri lanka',

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
    'hikkaduwa taxi service',
    'unawatuna taxi service',
    'mirissa taxi service',
    'bentota taxi service',
    'weligama taxi service',

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
  ],
  authors: [{ name: "Taxi Sri Lanka" }],
  creator: 'Taxi Sri Lanka',
  publisher: 'Taxi Sri Lanka',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taxisrilanka.com',
    siteName: 'Taxi Sri Lanka',
    title:
      'Taxi Sri Lanka – Tourist Taxi, Airport Transfers & Islandwide Tours',
    description:
      'Reliable taxi booking, airport transfers, car hire with driver, and tourist transport across Sri Lanka. Travel safely to beaches, hill country, cultural sites, and safaris.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Taxi Sri Lanka - Tourist Transport & Airport Transfers',
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
    title: 'Taxi Sri Lanka \'s Premier Taxi Service',
    description: 'Book reliable, affordable taxi services across Sri Lanka',
    images: ['/images/taxi-srilanak.png'],
  },
  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://taxisrilanka.com',
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
