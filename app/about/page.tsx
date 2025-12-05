"use client"

import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Zap, Shield, Smile, Phone, Star, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-5 md:py-15 overflow-hidden">
        <div className="absolute inset-0 opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About TaxiPickMe</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your trusted partner for reliable, affordable, and professional taxi services across Sri Lanka since 2015
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star size={20} />
              <span className="font-semibold">Award Winning Service</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Globe size={20} />
              <span className="font-semibold">Island Wide Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Driving Excellence Since 2015</h2>
              <p className="text-muted-foreground mb-4 text-lg">
                Founded in 2015, <strong>TaxiPickMe</strong> was born from a simple vision: to provide travelers with reliable,
                transparent, and professional taxi services across Sri Lanka's most popular destinations.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small operation with just 5 vehicles has grown to a fleet of over <strong>100 well-maintained
                vehicles</strong>, serving thousands of satisfied customers every month across the beautiful island of Sri Lanka.
              </p>
              <p className="text-muted-foreground mb-6">
                Our commitment to excellence, safety, and customer satisfaction has made us the <strong>preferred choice</strong> for
                both tourists exploring Sri Lanka and locals who value quality service.
              </p>
              <div className="flex gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Book a Ride
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary rounded-lg">
                      <TrendingUp size={32} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Growing Every Year</h3>
                      <p className="text-muted-foreground">
                        Expanding our fleet and services to better serve you across all of Sri Lanka.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary rounded-lg">
                      <Shield size={32} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Safety First</h3>
                      <p className="text-muted-foreground">
                        All vehicles regularly maintained and drivers thoroughly vetted and trained.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary rounded-lg">
                      <Star size={32} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">5-Star Service</h3>
                      <p className="text-muted-foreground">
                        Consistently rated excellent by our customers for professionalism and reliability.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              Our Values
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">What Drives Us Forward</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six core principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Safety First",
                description: "Every vehicle undergoes regular maintenance. All drivers are thoroughly screened and trained for your safety.",
                color: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
              },
              {
                icon: Smile,
                title: "Customer Care",
                description: "24/7 customer support ensures your comfort and peace of mind throughout your journey with us.",
                color: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400"
              },
              {
                icon: Zap,
                title: "Reliability",
                description: "We guarantee on-time pickups and professional service every single time you book with us.",
                color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"
              }
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <div className={`w-16 h-16 ${value.color} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose TaxiPickMe?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium taxi service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">24/7 Availability</h3>
                  <p className="text-muted-foreground">
                    Round-the-clock service including airport transfers, emergency rides, and special requests anytime you need us.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Instant Booking</h3>
                  <p className="text-muted-foreground">
                    Quick and easy online booking system with instant confirmation and real-time tracking of your ride.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Star size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Professional Drivers</h3>
                  <p className="text-muted-foreground">
                    Experienced, licensed drivers who know Sri Lanka's roads well and provide courteous, friendly service.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Competitive Pricing</h3>
                  <p className="text-muted-foreground">
                    Fair, transparent pricing with no hidden fees. Get the best value for your money with our competitive rates.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>


      <Footer />
    </main>
  )
}
