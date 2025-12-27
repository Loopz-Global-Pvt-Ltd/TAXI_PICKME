export interface ContactData {
  name: string
  email?: string | null
  phone?: string | null
  subject?: string | null
  message: string
  createdAt?: string
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function generateGuestContactEmail(data: ContactData): string {
  const received = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  return `
  <!doctype html>
  <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:Arial,Helvetica,sans-serif;background:#f7fafc;padding:18px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;">
        <h2 style="margin:0 0 8px 0">Thanks, ${escapeHtml(data.name || 'Guest')}</h2>
        <p style="margin:0 0 12px 0;color:#444">We received your message and will get back to you shortly.</p>

        <table style="width:100%;background:#f9fafb;border-radius:6px;padding:12px;">
          <tr><td style="font-size:13px;color:#6b7280;width:110px">Subject</td><td style="font-weight:600">${escapeHtml(data.subject || 'N/A')}</td></tr>
          <tr><td style="font-size:13px;color:#6b7280">Phone</td><td style="font-weight:600">${escapeHtml(data.phone || 'N/A')}</td></tr>
          <tr><td style="font-size:13px;color:#6b7280">Message</td><td style="padding-top:6px">${escapeHtml(data.message)}</td></tr>
        </table>

        <p style="margin:12px 0 0 0;color:#9ca3af;font-size:12px">Received: ${escapeHtml(received)}</p>
        <p style="margin:8px 0 0 0;font-size:12px;color:#9ca3af">Taxi Sri Lanka Tours</p>
      </div>
    </body>
  </html>
  `.trim()
}

export function generateGuestContactText(data: ContactData): string {
  const received = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  return `
  Thank you — we received your message.
  Name: ${data.name}
  Email: ${data.email || 'N/A'}
  Phone: ${data.phone || 'N/A'}
  Subject: ${data.subject || 'N/A'}

  Message:
  ${data.message}

  Received: ${received}

  Regards,
  Taxi Sri Lanka Tours
  `.trim()
}

export function generateAdminContactEmail(data: ContactData): string {
  const received = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  return `
  <!doctype html>
  <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;padding:18px;">
      <div style="max-width:700px;margin:0 auto;background:#fff;padding:18px;border-radius:8px;">
        <h3 style="margin:0 0 8px 0">🔔 New Contact Message</h3>
        <p style="margin:0 0 12px 0;color:#333;font-weight:600">${escapeHtml(data.name || 'N/A')} — ${escapeHtml(data.email || 'no email')}</p>

        <table style="width:100%;background:#fafafa;border-radius:6px;padding:12px;">
          <tr><td style="font-size:13px;color:#6b7280;width:120px">Subject</td><td style="font-weight:600">${escapeHtml(data.subject || 'N/A')}</td></tr>
          <tr><td style="font-size:13px;color:#6b7280">Phone</td><td>${escapeHtml(data.phone || 'N/A')}</td></tr>
          <tr><td style="font-size:13px;color:#6b7280;vertical-align:top">Message</td><td style="padding-top:6px">${escapeHtml(data.message)}</td></tr>
        </table>

        <p style="margin:12px 0 0 0;color:#9ca3af;font-size:12px">Received: ${escapeHtml(received)}</p>
      </div>
    </body>
  </html>
  `.trim()
}

export function generateAdminContactText(data: ContactData): string {
  const received = data.createdAt ? new Date(data.createdAt).toLocaleString() : new Date().toLocaleString()
  return `
  NEW CONTACT MESSAGE
  Name: ${data.name}
  Email: ${data.email || 'N/A'}
  Phone: ${data.phone || 'N/A'}
  Subject: ${data.subject || 'N/A'}

  Message:
  ${data.message}

  Received: ${received}
  `.trim()
}
