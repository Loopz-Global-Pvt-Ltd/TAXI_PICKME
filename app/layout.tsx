import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MapsProvider } from "@/components/providers/maps-provider"
import { HomeStructuredData } from '@/components/seo/HomeStructuredData'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Taxi Sri Lanka Tours | Airport Transfers, Tours, Cab & Car Hire with Driver",
    template: "%s | Taxi Sri Lanka Tours"
  },
  description: "Book reliable taxi service in Sri Lanka. Airport transfers from Colombo BIA, car hire with English-speaking driver, island-wide tours to Sigiriya, Kandy, Ella, Galle. 24/7 tourist transport with instant booking.",
  applicationName: "Taxi Sri Lanka Tours Tours",

  keywords: [
    "Taxi Sri Lanka",
    'BIA Airport Taxi',
    "Colombo Airport Transfer",
    "Private Driver Sri Lanka",
    "private Taxi Sri Lanka Tours",
    "Car Hire with Driver",
    "Sri Lanka Tour Packages",
    "Kandy Taxi Service",
    "Galle Taxi Service",
    "Mirissa Beach taxi service",
    "Dambulla Taxi Service",
    "Sigiriya Tours",
    "Ella Taxi Transfer",
    "24/7 Taxi Service"
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
      'facebook-domain-verification': 'YOUR_FB_VERIFICATION_CODE',
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        <meta name="google-site-verification" content="VUv4RmrTeTNue1hfJyek3oq_0DQiVZiK3_pv8czY79g" />  
        <HomeStructuredData />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17833215915"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17833215915');
          `}
        </Script>

        <MapsProvider>{children}</MapsProvider>
      </body>
    </html>
  )
}