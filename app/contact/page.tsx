"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Building2, CreditCard, Printer, Navigation } from "lucide-react"

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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
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
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-5 md:py-15 overflow-hidden">
        <div className="absolute inset-0 opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your trusted partner for luxury taxi services across Sri Lanka
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Phone size={20} />
              <span className="font-semibold">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Navigation size={20} />
              <span className="font-semibold">Island Wide Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      {/* <section className="bg-gradient-to-r from-green-600 to-green-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-center">
            <a href="tel:+94777850529" className="flex items-center justify-center gap-3 hover:bg-white/10 p-3 rounded-lg transition">
              <Phone size={24} />
              <div className="text-left">
                <div className="text-xs opacity-90">Call Now</div>
                <div className="font-bold text-lg">+94 77 785 0529</div>
              </div>
            </a>
            <a href="mailto:upultaxi@yahoo.com" className="flex items-center justify-center gap-3 hover:bg-white/10 p-3 rounded-lg transition">
              <Mail size={24} />
              <div className="text-left">
                <div className="text-xs opacity-90">Email Us</div>
                <div className="font-bold text-lg">sritaxi@gmail.com</div>
              </div>
            </a>
            <div className="flex items-center justify-center gap-3 hover:bg-white/10 p-3 rounded-lg transition">
              <Clock size={24} />
              <div className="text-left">
                <div className="text-xs opacity-90">Service Hours</div>
                <div className="font-bold text-lg">24/7 Available</div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-6">
              
              {/* Head Office */}
              <Card className="p-8 border-2 border-green-100 dark:border-green-900">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Building2 size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Head Office</h2>
                    <p className="text-muted-foreground">Upul Taxi Service</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">U.P.K Hulangamuwa</p>
                      <p className="text-muted-foreground">44 Mile post, Kandy Road</p>
                      <p className="text-muted-foreground">Dambulla, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-green-600 mt-1 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">Telephone</p>
                        <a href="tel:+94777850529" className="block text-foreground hover:text-green-600 font-medium">+94 (0) 77 785 0529</a>
                        <a href="tel:+94777850829" className="block text-foreground hover:text-green-600 font-medium">+94 (0) 77 785 0829</a>
                        <a href="tel:+94727850829" className="block text-foreground hover:text-green-600 font-medium">+94 (0) 72 785 0829</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Printer size={20} className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Fax</p>
                        <p className="text-foreground font-medium">+94 (0) 66 228 5076</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-green-600 mt-1 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground">Email</p>
                        <a href="mailto:upultaxi@yahoo.com" className="block text-foreground hover:text-green-600 font-medium">upultaxi@yahoo.com</a>
                        <a href="mailto:sritaxi@gmail.com" className="block text-foreground hover:text-green-600 font-medium">sritaxi@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bank Details */}
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <CreditCard size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Bank Details</h2>
                    <p className="text-muted-foreground">For Direct Payments</p>
                  </div>
                </div>

                <div className="space-y-3 bg-white dark:bg-slate-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-bold text-foreground">Taxisrilanka Tours</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-mono font-bold text-foreground">8540021900</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-bold text-foreground">Commercial Bank</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-bold text-foreground">Dambulla</span>
                  </div>
                </div>
              </Card>

              {/* Business Hours */}
              <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Clock size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Service Hours</h2>
                    <p className="text-muted-foreground">We're always here for you</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <span className="font-medium text-foreground">Every Day</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">24/7 Available</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Emergency Support Available
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Airport Transfers Anytime
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Instant Booking Confirmation
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8 sticky top-24">
                <h2 className="text-3xl font-bold text-foreground mb-2">Send us a Message</h2>
                <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you shortly</p>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 dark:border-green-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-green-500 rounded-full">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">Message Sent Successfully!</p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground mb-2 block">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="h-12" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground mb-2 block">Email Address *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="h-12" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold text-foreground mb-2 block">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+94 77 XXX XXXX" className="h-12" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-semibold text-foreground mb-2 block">Subject *</Label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full h-12 px-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground bg-background">
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="airport">Airport Transfer</option>
                      <option value="tour">Tour Package</option>
                      <option value="corporate">Corporate Services</option>
                      <option value="support">Customer Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-semibold text-foreground mb-2 block">Your Message *</Label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help you..." rows={6} required className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground bg-background resize-none" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-bold rounded-lg shadow-lg transition-all disabled:opacity-50">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2" size={20} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Find Us on the Map</h2>
          <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Map will be integrated here</p>
              <p className="text-sm text-gray-400 mt-2">44 Mile post, Kandy Road, Dambulla, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
