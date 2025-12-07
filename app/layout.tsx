import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { MapsProvider } from "@/components/providers/maps-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sri Lanka Taxi Booking - Reliable Airport & Tour Transfers",
  description:
    "Book licensed taxis for airport transfers, city tours, and multi-day trips across Sri Lanka. 24/7 support, transparent pricing, professional drivers.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/images/taxi-srilanak-log.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/taxi-srilanak-log.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/taxi-srilanak-log.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <MapsProvider>
          {children}
        </MapsProvider>
        <Analytics />
      </body>
    </html>
  )
}
