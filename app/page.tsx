import Link from 'next/link';
import { ArrowRight, Shield, Clock, DollarSign, Star, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Reliable',
      description: 'Licensed drivers and well-maintained vehicles for your safety',
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Book anytime, anywhere across Sri Lanka',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden charges, know your fare upfront',
    },
    {
      icon: Star,
      title: 'Experienced Drivers',
      description: 'Professional drivers who know Sri Lanka like the back of their hand',
    },
  ];

  const popularRoutes = [
    {
      from: 'Colombo',
      to: 'Kandy',
      distance: '115 km',
      duration: '3 hours',
      price: 'From LKR 9,775',
    },
    {
      from: 'Colombo',
      to: 'Galle',
      distance: '119 km',
      duration: '2.5 hours',
      price: 'From LKR 10,615',
    },
    {
      from: 'Kandy',
      to: 'Nuwara Eliya',
      distance: '77 km',
      duration: '2.5 hours',
      price: 'From LKR 6,545',
    },
    {
      from: 'Colombo',
      to: 'Sigiriya',
      distance: '169 km',
      duration: '4 hours',
      price: 'From LKR 14,365',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Explore Sri Lanka
            <br />
            <span className="text-orange-300">In Comfort</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Premium taxi services across the island. Safe, reliable, and affordable.
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Book Your Ride Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Taxi Pickme?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="routes" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Routes
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover the most traveled destinations across Sri Lanka with our reliable service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">{route.from}</div>
                      <div className="text-sm text-muted-foreground">to</div>
                      <div className="font-semibold">{route.to}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>Distance: {route.distance}</div>
                    <div>Duration: {route.duration}</div>
                  </div>
                  <div className="text-xl font-bold text-primary mb-4">{route.price}</div>
                  <Link href="/booking">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book your taxi in just a few clicks and explore the beauty of Sri Lanka
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section id="contact" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions? We're here to help. Reach out to us anytime.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">+94 77 123 4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">info@sritaxi.lk</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">Colombo, Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea placeholder="How can we help you?" rows={4} />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
