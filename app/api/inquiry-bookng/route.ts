import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { query } from "@/lib/db"

const createInquirySchema = z.object({
  fullName: z.string().min(2).max(255),
  email: z.string().email().max(255).optional().nullable(),
  phone: z.string().min(7).max(30),
  nationality: z.string().max(100).optional().nullable(),
  vehicleType: z.string().max(100).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  adults: z.preprocess((v) => Number(v), z.number().int().min(0)).optional().nullable(),
  children: z.preprocess((v) => Number(v), z.number().int().min(0)).optional().nullable(),
  comments: z.string().max(2000).optional().nullable(),
  locations: z.array(z.any()).optional().nullable(),
})

function generateInquiryReference(): string {
  const ts = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
  const rnd = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `IQ-${ts}-${rnd}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createInquirySchema.parse(body)

    const inquiryReference = generateInquiryReference()

    const result = await query(
      `INSERT INTO inquiry_bookings (
        inquiry_reference, full_name, email, phone, nationality, vehicle_type,
        start_date, end_date, adults, children, comments, locations, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      ) RETURNING *`,
      [
        inquiryReference,
        data.fullName,
        data.email || null,
        data.phone,
        data.nationality || null,
        data.vehicleType || null,
        data.startDate ? data.startDate : null,
        data.endDate ? data.endDate : null,
        data.adults ?? null,
        data.children ?? null,
        data.comments || null,
        data.locations ? JSON.stringify(data.locations) : null,
        "new",
      ]
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (err: any) {
    console.error("Inquiry create error:", err)
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Validation error", details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: err.message || "Failed to create inquiry" }, { status: 500 })
  }
}