// ...new file...
export interface InquiryEmailData {
  inquiryReference: string
  fullName: string
  email?: string | null
  phone: string
  nationality?: string | null
  vehicleType?: string | null
  startDate?: string | null
  endDate?: string | null
  adults?: number | null
  children?: number | null
  comments?: string | null
  locations?: any[] | null
  createdAt?: string
}
export function generateInquiryGuestEmail(data: InquiryEmailData): string {
  const locationsHtml = (data.locations && Array.isArray(data.locations) && data.locations.length)
    ? `<ul style="margin:0;padding-left:18px;">${data.locations.map((loc) => `<li>${escapeHtml(String(loc?.name ?? loc))}</li>`).join("")}</ul>`
    : `<p style="margin:0;">N/A</p>`

  const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width"/>
    <title>Inquiry Received</title>
  </head>
  <body style="margin:0;padding:0;font-family: Arial, Helvetica, sans-serif;background:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;background:#f4f4f4;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08)">
            <tr>
              <td style="background:linear-gradient(90deg,#000000 0%,#333333 100%);padding:28px;text-align:center;color:#fff;">
                <h1 style="margin:0;font-size:22px;">🚖 Taxi Sri Lanka Tours</h1>
                <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9">Inquiry Received</p>
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px;border-radius:6px;">
                  <p style="margin:0;color:#92400E;font-weight:600">Reference: <span style="font-family:monospace">${escapeHtml(String(data.inquiryReference))}</span></p>
                </div>

                <h3 style="margin:18px 0 8px 0;color:#111;font-size:16px;">Hello ${escapeHtml(String(data.fullName || 'Guest'))},</h3>
                <p style="margin:0 0 12px 0;color:#444">Thanks — we received your inquiry. Our team will review and contact you shortly.</p>

                <table width="100%" cellpadding="6" cellspacing="0" style="margin-top:12px;background:#fafafa;border-radius:6px;">
                  <tr>
                    <td style="width:40%;color:#6b7280;font-size:13px"><strong>Phone</strong></td>
                    <td style="color:#111;font-weight:600">${escapeHtml(String(data.phone || 'N/A'))}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Email</strong></td>
                    <td style="color:#111;font-weight:600">${escapeHtml(String(data.email || 'N/A'))}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Nationality</strong></td>
                    <td style="color:#111">${escapeHtml(String(data.nationality || 'N/A'))}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Vehicle</strong></td>
                    <td style="color:#111">${escapeHtml(String(data.vehicleType || 'N/A'))}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Dates</strong></td>
                    <td style="color:#111">${escapeHtml(String(data.startDate || 'N/A'))}${data.endDate ? ` — ${escapeHtml(String(data.endDate))}` : ''}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Guests</strong></td>
                    <td style="color:#111">${data.adults ?? 'N/A'} adults · ${data.children ?? 'N/A'} children</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px"><strong>Locations</strong></td>
                    <td style="color:#111;padding-top:6px">${locationsHtml}</td>
                  </tr>
                </table>

                ${data.comments ? `<div style="margin-top:14px;padding:12px;border-radius:6px;background:#fff7ed;border:1px solid #fbe5c7;color:#92400E"><strong>Comments</strong><div style="margin-top:6px">${escapeHtml(String(data.comments))}</div></div>` : ''}

                <p style="margin:18px 0 0 0;color:#6b7280;font-size:12px">Received: ${escapeHtml(receivedAt)}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px;background:#f9fafb;text-align:center;color:#6b7280;font-size:13px;">
                Contact: <strong>+94 777 850 529</strong> · <a href="mailto:sritaxi@gmail.com" style="color:#3b82f6;text-decoration:none">sritaxi@gmail.com</a>
                <div style="margin-top:8px;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Taxi Sri Lanka Tours</div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `.trim()
}

export function generateInquiryGuestText(data: InquiryEmailData): string {
  const locationsText = (data.locations && Array.isArray(data.locations) && data.locations.length)
    ? data.locations.map(l => String(l?.name ?? l)).join(" → ")
    : "N/A"

  const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()

  return `
  Thank you — Inquiry received
  Reference: ${data.inquiryReference}

  Hello ${data.fullName},

  We received your inquiry. We will contact you soon.

  Phone: ${data.phone}
  Nationality: ${data.nationality || 'N/A'}
  Vehicle: ${data.vehicleType || 'N/A'}
  Dates: ${data.startDate || 'N/A'} - ${data.endDate || 'N/A'}
  Adults: ${data.adults ?? 'N/A'}, Children: ${data.children ?? 'N/A'}

  ${data.comments ? `Comments: ${data.comments}\n\n` : ''}
  Locations: ${locationsText}

  Received: ${receivedAt}

  Regards,
  Taxi Sri Lanka Tours
  `.trim()
}

// simple HTML escape to avoid injecting raw content into email
function escapeHtml(input: string) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  export function generateAdminInquiryEmail(data: InquiryEmailData): string {
    const locationsHtml = (data.locations && Array.isArray(data.locations) && data.locations.length)
      ? `<ul style="margin:0;padding-left:18px;">${data.locations.map((loc) => `<li>${escapeHtml(String(loc?.name ?? loc))}</li>`).join("")}</ul>`
      : `<p style="margin:0;">N/A</p>`
  
    const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
    <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;background:#f4f4f4;">
        <tr><td align="center">
          <table width="700" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08)">
            <tr>
              <td style="background:linear-gradient(90deg,#ef4444 0%,#dc2626 100%);padding:28px;text-align:center;color:#fff;">
                <h1 style="margin:0;font-size:22px;">🔔 New Inquiry Received</h1>
                <p style="margin:6px 0 0 0;font-size:13px;opacity:0.95">Action recommended — review the inquiry</p>
              </td>
            </tr>
  
            <tr><td style="padding:20px;">
              <div style="background:#dbecff;border-left:4px solid #3b82f6;padding:12px;border-radius:6px;">
                <p style="margin:0;color:#1e40af;font-weight:700">Reference: <span style="font-family:monospace">${escapeHtml(String(data.inquiryReference))}</span></p>
              </div>
  
              <h3 style="margin:16px 0 8px 0;color:#111">Customer</h3>
              <p style="margin:0 0 12px 0;color:#111;font-weight:700">${escapeHtml(String(data.fullName || 'N/A'))} · <a href="mailto:${escapeHtml(String(data.email || ''))}" style="color:#3b82f6;text-decoration:none">${escapeHtml(String(data.email || 'no email'))}</a> · <a href="tel:${escapeHtml(String(data.phone))}" style="color:#10b981;text-decoration:none">${escapeHtml(String(data.phone))}</a></p>
  
              <h4 style="margin:10px 0 6px 0;color:#111">Details</h4>
              <table width="100%" cellpadding="6" cellspacing="0" style="background:#fafafa;border-radius:6px;">
                <tr><td style="width:35%;color:#6b7280;font-size:13px"><strong>Nationality</strong></td><td style="color:#111">${escapeHtml(String(data.nationality || 'N/A'))}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px"><strong>Vehicle</strong></td><td style="color:#111">${escapeHtml(String(data.vehicleType || 'N/A'))}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px"><strong>Dates</strong></td><td style="color:#111">${escapeHtml(String(data.startDate || 'N/A'))}${data.endDate ? ` — ${escapeHtml(String(data.endDate))}` : ''}</td></tr>
                <tr><td style="color:#6b7280;font-size:13px"><strong>Guests</strong></td><td style="color:#111">${data.adults ?? 'N/A'} adults · ${data.children ?? 'N/A'} children</td></tr>
                <tr><td style="color:#6b7280;font-size:13px"><strong>Locations</strong></td><td style="color:#111">${locationsHtml}</td></tr>
              </table>
  
              ${data.comments ? `<div style="margin-top:14px;padding:12px;border-radius:6px;background:#fff7ed;border:1px solid #fbe5c7;color:#92400E"><strong>Comments</strong><div style="margin-top:6px">${escapeHtml(String(data.comments))}</div></div>` : ''}
  
              <p style="margin:18px 0 0 0;color:#6b7280;font-size:12px">Received: ${escapeHtml(receivedAt)}</p>
            </td></tr>
  
            <tr><td style="padding:18px;background:#f9fafb;text-align:center;color:#6b7280;font-size:13px;">
              <a href="mailto:${escapeHtml(String(process.env.SMTP_FROM_EMAIL || 'sritaxi@gmail.com'))}" style="color:#3b82f6;text-decoration:none">Open Admin</a> · <span style="margin-left:8px">© ${new Date().getFullYear()} Taxi Sri Lanka Tours</span>
            </td></tr>
  
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    `.trim()
  }
export function generateAdminInquiryText(data: InquiryEmailData): string {
    const locationsText = (data.locations && Array.isArray(data.locations) && data.locations.length)
      ? data.locations.map(l => String(l?.name ?? l)).join(" → ")
      : "N/A"
    const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  
    return `
  NEW INQUIRY
  Reference: ${data.inquiryReference}
  Name: ${data.fullName}
  Email: ${data.email || 'N/A'}
  Phone: ${data.phone}
  Nationality: ${data.nationality || 'N/A'}
  Vehicle: ${data.vehicleType || 'N/A'}
  Dates: ${data.startDate || 'N/A'} - ${data.endDate || 'N/A'}
  Adults: ${data.adults ?? 'N/A'} Children: ${data.children ?? 'N/A'}
  
  ${data.comments ? `Comments: ${data.comments}\n\n` : ''}
  
  Locations: ${locationsText}
  
  Received: ${receivedAt}
  `.trim()
}
