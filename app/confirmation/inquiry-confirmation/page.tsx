"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Phone, MapPin, Calendar } from "lucide-react"

interface InquiryConfirmationData {
  inquiry_reference: string
  full_name?: string
  email?: string
  phone?: string
  nationality?: string
  vehicle_type?: string
  start_date?: string
  end_date?: string
  adults?: number
  children?: number
  comments?: string
  locations?: any[]
  created_at?: string
  status?: string
}

export default function InquiryConfirmationPage() {
  const router = useRouter()
  const [data, setData] = useState<InquiryConfirmationData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("inquiryConfirmationData")
    if (!stored) {
      router.push("/")
      return
    }
    try {
      setData(JSON.parse(stored))
    } catch {
      router.push("/")
    }
  }, [router])

  if (!data) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="py-24">
          <div className="max-w-3xl mx-auto text-center">Loading…</div>
        </div>
        <Footer />
      </main>
    )
  }

  const safeFilename = (name: string) =>
    name
      .replace(/[^a-zA-Z0-9._-]/g, "_")   // remove weird chars
      .slice(0, 80);                     // keep it reasonable
  
  const handleDownload = () => {
    const content = `INQUIRY SUBMITTED
  
  Reference: ${data.inquiry_reference}
  Name: ${data.full_name || "—"}
  Phone: ${data.phone || "—"}
  Email: ${data.email || "—"}
  Nationality: ${data.nationality || "—"}
  Vehicle type: ${data.vehicle_type || "—"}
  Start: ${data.start_date || "—"}
  End: ${data.end_date || "—"}
  Adults: ${data.adults ?? "—"}
  Children: ${data.children ?? "—"}
  Locations: ${Array.isArray(data.locations) ? data.locations.map(l => l?.name ?? l).join(" > ") : "—"}
  Comments: ${data.comments || "—"}
  Submitted: ${data.created_at || new Date().toISOString()}
  
  Thank you! We will contact you shortly.
  `;
  
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
  
    const ref = data.inquiry_reference || "unknown";
    a.download = safeFilename(`inquiry-${ref}.txt`);
  
    // No appendChild (this is what Snyk is complaining about)
    a.click();
  
    URL.revokeObjectURL(url);
  };
  
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle size={64} className="text-yellow-400 mx-auto" />
            <h1 className="text-3xl font-bold mt-4">Inquiry Submitted</h1>
            <p className="text-muted-foreground mt-2">Reference: <span className="font-mono font-semibold">{data.inquiry_reference}</span></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail /> <div><div className="text-sm text-muted-foreground">Email</div><div className="font-semibold">{data.email || "—"}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone /> <div><div className="text-sm text-muted-foreground">Phone</div><div className="font-semibold">{data.phone || "—"}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin /> <div><div className="text-sm text-muted-foreground">Locations</div><div className="font-semibold">{Array.isArray(data.locations) ? data.locations.map(l => l.name ?? l).join(" → ") : "—"}</div></div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div><strong>Nationality:</strong> {data.nationality || "—"}</div>
                  <div><strong>Vehicle type:</strong> {data.vehicle_type || "—"}</div>
                  <div><strong>Dates:</strong> {data.start_date || "—"} {data.end_date ? `— ${data.end_date}` : ""}</div>
                  <div><strong>Guests:</strong> {data.adults ?? "—"} / {data.children ?? "—"}</div>
                  <div><strong>Comments:</strong> {data.comments || "—"}</div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 mb-6">
                <h4 className="font-semibold mb-4">Next Steps</h4>
                <ol className="text-sm space-y-2">
                  <li>Our team will review and contact you within 24 hours.</li>
                  <li>We may offer suggestions or confirm pricing and availability.</li>
                </ol>
              </Card>

              <div className="space-y-3">
                <Button onClick={handleDownload} variant="outline" className="w-full"> <Download size={14} /> Download Receipt</Button>
                <Link href="/" className="block">
                  <Button className="w-full">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}