"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      category: "Booking & Reservations",
      items: [
        {
          question: "How do I book a taxi with Sri Lanka Taxi?",
          answer:
            "Simply visit our website, enter your pickup and dropoff locations, select your travel date and time, and choose your preferred vehicle. Complete your passenger information and proceed to payment to confirm your booking.",
        },
        {
          question: "Can I make a booking in advance?",
          answer:
            "Yes! You can book up to 30 days in advance. We recommend booking at least 24 hours before your required travel time to ensure vehicle availability.",
        },
        {
          question: "Is there a cancellation fee?",
          answer:
            "Free cancellations are available up to 6 hours before your scheduled pickup time. Cancellations made within 6 hours may incur a 50% charge. No-shows will be charged in full.",
        },
        {
          question: "Can I modify my booking after confirming?",
          answer:
            "Yes, you can modify your booking up to 2 hours before pickup time. Please contact our customer support for assistance with any changes.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      items: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards, mobile wallets (eZ Cash, Dialog iMi, Mobitel Migs), and bank transfers. All payments are processed securely.",
        },
        {
          question: "Are there any hidden charges?",
          answer:
            "No, we maintain complete transparency. The price shown at booking includes fuel, insurance, and tolls. No additional charges apply.",
        },
        {
          question: "Do you offer discounts for group bookings or long-term rentals?",
          answer:
            "Yes! We offer attractive discounts for bookings of 7+ days and group bookings of 3+ vehicles. Please contact our sales team for customized quotes.",
        },
        {
          question: "Is travel insurance included?",
          answer:
            "Yes, comprehensive travel insurance is included in all our rides at no extra cost. You're fully covered throughout your journey.",
        },
      ],
    },
    {
      category: "Vehicles & Drivers",
      items: [
        {
          question: "How often are vehicles serviced?",
          answer:
            "All vehicles undergo regular maintenance every 2 weeks. We also perform safety inspections before each trip to ensure optimal condition.",
        },
        {
          question: "Are your drivers professionally trained?",
          answer:
            "All drivers are thoroughly background-checked, licensed, and trained in customer service. Many speak multiple languages.",
        },
        {
          question: "Can I request a specific driver?",
          answer:
            "You can request a driver through special requests during booking. We'll accommodate your request based on availability.",
        },
        {
          question: "What if I need a special vehicle (child seat, wheelchair accessible, etc.)?",
          answer:
            "Let us know your requirements during booking through special requests. We'll arrange the appropriate vehicle for your needs.",
        },
      ],
    },
    {
      category: "During Your Trip",
      items: [
        {
          question: "What if the driver is late?",
          answer:
            "Our drivers aim to arrive 5 minutes early. If delayed, you'll be notified immediately. In rare cases, we offer compensation for significant delays.",
        },
        {
          question: "Can the driver help with luggage?",
          answer:
            "Yes, drivers will assist with loading and unloading luggage. However, heavy items (over 25kg) may require additional help.",
        },
        {
          question: "Are there any age restrictions for passengers?",
          answer:
            "Passengers must be at least 18 years old unless traveling with an adult. Children are welcome and we provide appropriate safety measures.",
        },
        {
          question: "What should I do if there's an issue during the trip?",
          answer:
            "Contact our 24/7 support team immediately. We're available via phone, WhatsApp, or in-app chat to resolve any concerns.",
        },
      ],
    },
    {
      category: "Safety & Support",
      items: [
        {
          question: "Is my personal information secure?",
          answer:
            "Yes, we use industry-standard encryption to protect all your personal and payment information. Your data is never shared with third parties.",
        },
        {
          question: "Do you have 24/7 customer support?",
          answer:
            "Yes! Our customer support team is available 24/7 via phone, email, WhatsApp, and live chat to assist with any questions or concerns.",
        },
        {
          question: "What if I lost something in the taxi?",
          answer:
            "Contact us immediately with details of your booking. We'll help trace your item and arrange recovery or delivery.",
        },
        {
          question: "How do you ensure driver safety?",
          answer:
            "We maintain strict safety protocols including vehicle GPS tracking, emergency communication systems, and regular driver training.",
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our taxi services, booking, and support.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{section.category}</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="border p-0">
                      <AccordionItem value={`${sectionIndex}-${itemIndex}`} className="border-none">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition">
                          <span className="text-left font-semibold text-foreground">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 text-muted-foreground border-t border-border">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="mt-12 p-8 bg-primary/10 border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-2">Didn't find your answer?</h3>
            <p className="text-muted-foreground mb-6">
              Our customer support team is ready to help. Contact us anytime.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="tel:+94112345678"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
              >
                Call Us: +94 11 234 5678
              </a>
              <a
                href="/contact"
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-semibold"
              >
                Send Message
              </a>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
