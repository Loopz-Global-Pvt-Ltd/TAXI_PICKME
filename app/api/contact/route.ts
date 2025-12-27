import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/mailer"
import {
  ContactData,
  generateAdminContactEmail,
  generateAdminContactText,
  generateGuestContactEmail,
  generateGuestContactText,
} from "@/lib/email/contactTemplate"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // basic validation
    if (!body?.name || !body?.message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const data: ContactData = {
      name: String(body.name),
      email: body.email ? String(body.email) : null,
      phone: body.phone ? String(body.phone) : null,
      subject: body.subject ? String(body.subject) : null,
      message: String(body.message),
      createdAt: new Date().toISOString(),
    }

    const adminEmail = process.env.CONTACT_ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL
    if (!adminEmail) {
      return NextResponse.json({ success: false, error: "Admin email not configured" }, { status: 500 })
    }

    // send admin notification
    await sendEmail({
      to: adminEmail,
      subject: `New Contact Message${data.subject ? `: ${data.subject}` : ""}`,
      html: generateAdminContactEmail(data),
      text: generateAdminContactText(data),
    })

    // send acknowledgement to visitor if email provided
    if (data.email) {
      await sendEmail({
        to: data.email,
        subject: "We've received your message",
        html: generateGuestContactEmail(data),
        text: generateGuestContactText(data),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 })
  }
}
