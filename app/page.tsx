import Header from "@/components/Header"
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
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrustBadges />
      {/* <FeaturedTours /> */}
      <Testimonials />
      <WhyChooseUs />
      {/* <PopularRoutes /> */}
      <SafetyCommitment />
      {/* <Partnerships /> */}
      <Statistics />
      <Footer />
      <WhatsAppButton 
          phoneNumber="94777850529" // Replace with your actual WhatsApp number
          message="Hello! I'm interested in learning more about DD Academy Could you please provide more information?"
          position="bottom-right"
          showTooltip={true}
        />
    </main>
  )
}
