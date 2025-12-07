import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MapsProvider } from "@/components/providers/maps-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaxiPickMe - Sri Lanka's Premier Taxi Service",
  description: "Book reliable, affordable taxi services across Sri Lanka. Professional drivers, luxury comfort, competitive rates. Available 24/7 for airport transfers and tours.",
  keywords: "Sri Lanka taxi, airport transfer, taxi service, Colombo taxi, Sri Lanka tours, reliable taxi",
  authors: [{ name: "TaxiPickMe" }],
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
  openGraph: {
    title: 'TaxiPickMe - Sri Lanka\'s Premier Taxi Service',
    description: 'Book reliable, affordable taxi services across Sri Lanka',
    url: 'https://taxipickme.com',
    siteName: 'TaxiPickMe',
    images: [
      {
        url: '/images/taxi-srilanaka.png',
        width: 1200,
        height: 630,
        alt: 'TaxiPickMe',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaxiPickMe - Sri Lanka\'s Premier Taxi Service',
    description: 'Book reliable, affordable taxi services across Sri Lanka',
    images: ['/images/taxi-srilanak.png'],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <MapsProvider>{children}</MapsProvider>
      </body>
    </html>
  )
}
