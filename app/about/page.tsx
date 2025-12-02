"use client"

import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Zap, Shield, Smile } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Sri Lanka Taxi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for reliable, affordable, and professional taxi services across Sri Lanka since 2015.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2015, Sri Lanka Taxi was born from a simple vision: to provide travelers with reliable,
                transparent, and professional taxi services across Sri Lanka's most popular destinations.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small operation with just 5 vehicles has grown to a fleet of over 200 well-maintained
                vehicles, serving thousands of satisfied customers every month.
              </p>
              <p className="text-muted-foreground">
                Our commitment to excellence, safety, and customer satisfaction has made us the preferred choice for
                tourists and locals alike.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Globe size={64} className="text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Serving Sri Lanka since 2015</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Safety First",
                description:
                  "Every vehicle undergoes regular maintenance. All drivers are thoroughly screened and trained.",
              },
              {
                icon: Smile,
                title: "Customer Care",
                description: "24/7 customer support ensures your comfort and peace of mind throughout your journey.",
              },
              {
                icon: Zap,
                title: "Reliability",
                description: "We guarantee on-time pickups and professional service every single time.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "Quality service is not a goal—it's our standard. We continuously improve to exceed expectations.",
              },
              {
                icon: Globe,
                title: "Community",
                description: "We support local communities and contribute to sustainable tourism in Sri Lanka.",
              },
              {
                icon: Users,
                title: "Transparency",
                description: "No hidden charges. Our pricing is clear, fair, and competitive throughout.",
              },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                  <Icon size={40} className="text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "200+", label: "Vehicles" },
              { number: "500K+", label: "Happy Customers" },
              { number: "1M+", label: "Trips Completed" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Experience Our Service?</h2>
          <p className="text-lg text-muted-foreground mb-8">Book your next ride with Sri Lanka Taxi today</p>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book a Ride
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
