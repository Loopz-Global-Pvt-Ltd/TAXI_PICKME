import Header from "@/components/header"
import Hero from "@/components/hero"
import TrustBadges from "@/components/trust-badges"
import Testimonials from "@/components/testimonials"
import WhyChooseUs from "@/components/why-choose-us"
import PopularRoutes from "@/components/popular-routes"
import FeaturedTours from "@/components/featured-tours"
import Statistics from "@/components/statistics"
import Partnerships from "@/components/partnerships"
import SafetyCommitment from "@/components/safety-commitment"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrustBadges />
      <FeaturedTours />
      <Testimonials />
      <WhyChooseUs />
      <PopularRoutes />
      <SafetyCommitment />
      <Partnerships />
      <Statistics />
      <Footer />
    </main>
  )
}
