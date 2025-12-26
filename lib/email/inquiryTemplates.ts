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
    ? `<h4>Locations</h4><ul>${data.locations.map((loc) => `<li>${escapeHtml(String(loc?.name ?? loc))}</li>`).join("")}</ul>`
    : `<p><strong>Locations:</strong> N/A</p>`

  const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()

  return `
  <html>
    <body style="font-family: Arial, sans-serif; color:#111;">
      <h2>Thank you — Inquiry received</h2>
      <p>Hi ${escapeHtml(String(data.fullName || ''))},</p>
      <p>We received your inquiry (Reference: <strong>${escapeHtml(String(data.inquiryReference))}</strong>). Our team will contact you shortly.</p>
      <h4>Summary</h4>
      <ul>
        <li>Phone: ${escapeHtml(String(data.phone || ''))}</li>
        <li>Nationality: ${escapeHtml(String(data.nationality || 'N/A'))}</li>
        <li>Vehicle type: ${escapeHtml(String(data.vehicleType || 'N/A'))}</li>
        <li>From: ${escapeHtml(String(data.startDate || 'N/A'))} — To: ${escapeHtml(String(data.endDate || 'N/A'))}</li>
        <li>Adults: ${data.adults ?? 'N/A'}, Children: ${data.children ?? 'N/A'}</li>
      </ul>
      ${data.comments ? `<h4>Comments</h4><p>${escapeHtml(String(data.comments))}</p>` : ''}
      ${locationsHtml}
      <p>Reference: <strong>${escapeHtml(String(data.inquiryReference))}</strong></p>
      <p>Received at: ${escapeHtml(receivedAt)}</p>
      <p>Regards,<br/>Taxi Sri Lanka Tours</p>
    </body>
  </html>
  `
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
      ? `<h4>Locations</h4><ul>${data.locations.map((loc) => `<li>${escapeHtml(String(loc?.name ?? loc))}</li>`).join("")}</ul>`
      : `<p><strong>Locations:</strong> N/A</p>`
        const receivedAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
      
        return `
  <html>
    <body style="font-family: Arial, sans-serif; color:#111;">
      <h2>New Inquiry Received</h2>
      <p>Reference: <strong>${data.inquiryReference}</strong></p>
      <h4>Customer</h4>
      <p>${data.fullName} — ${data.email || 'no email'} — ${data.phone}</p>
      <h4>Details</h4>
      <ul>
        <li>Nationality: ${data.nationality || 'N/A'}</li>
        <li>Vehicle type: ${data.vehicleType || 'N/A'}</li>
        <li>Start: ${data.startDate || 'N/A'}</li>
        <li>End: ${data.endDate || 'N/A'}</li>
        <li>Adults: ${data.adults ?? 'N/A'}</li>
        <li>Children: ${data.children ?? 'N/A'}</li>
      </ul>
      ${data.comments ? `<h4>Comments</h4><p>${data.comments}</p>` : ''}
      ${locationsHtml}
      <p>Received at: ${escapeHtml(receivedAt)}</p>
    </body>
  </html>
  `
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
