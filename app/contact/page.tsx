"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? Our team is here to help. Contact us anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-6 text-center hover:shadow-lg transition">
              <Phone size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground mb-3">Call us anytime for immediate assistance</p>
              <a href="tel:+94112345678" className="text-primary font-semibold hover:underline">
                +94 777 850 529
              </a>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition">
              <Mail size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-3">Reach out to us via email</p>
              <a href="mailto:support@srilankataxi.com" className="text-primary font-semibold hover:underline">
                support@srilankataxi.com
              </a>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition">
              <MapPin size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Office</h3>
              <p className="text-muted-foreground">
                123 Galle Road
                <br />
                Colombo 03, Sri Lanka
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg text-green-900 dark:text-green-100 text-sm">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 (optional)"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject
                    </Label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Related</option>
                      <option value="support">Customer Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="corporate">Corporate Enquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      rows={5}
                      required
                      className="w-full mt-2 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Business Hours & Additional Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Clock size={24} className="text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground">Monday - Friday</span>
                    <span className="font-semibold text-foreground">6:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Saturday</span>
                    <span className="font-semibold text-foreground">6:00 AM - 12:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Sunday</span>
                    <span className="font-semibold text-foreground">6:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-foreground font-semibold">Emergency Support</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/10 border-primary/20">
                <h3 className="text-lg font-bold text-foreground mb-3">Follow Us</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with us on social media for updates and special offers
                </p>
                <div className="flex gap-3">
                  {["Facebook", "Instagram", "Twitter", "WhatsApp"].map((social) => (
                    <button
                      key={social}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm font-semibold"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent issues during a ride, call our emergency support team immediately.
                </p>
                <a
                  href="tel:+94112345678"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                >
                  Call Emergency Line
                </a>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
