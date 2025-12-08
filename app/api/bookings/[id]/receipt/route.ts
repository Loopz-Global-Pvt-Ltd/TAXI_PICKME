import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect()

  try {
    const { id } = await params
    const bookingId = parseInt(id)

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    // Fetch booking with vehicle and payment details
    const result = await client.query(
      `SELECT 
        b.*,
        v.name as vehicle_name,
        v.category as vehicle_category,
        v.price_per_km as vehicle_price_per_km,
        p.reference_number as payment_reference,
        p.status as payment_status,
        p.onepay_transaction_id,
        p.paid_at,
        p.payment_method
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.id = $1`,
      [bookingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = result.rows[0]

    // Generate HTML receipt
    const html = generateReceiptHTML(booking)

    // Return HTML for now (you can use a PDF library like puppeteer or pdfkit in production)
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="receipt-${booking.booking_reference}.html"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating receipt:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate receipt' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

function generateReceiptHTML(booking: any): string {
  const isPaid = booking.payment_status === 'paid' || booking.payment_status === 'completed'
  const paymentMethod = booking.payment_method === 'cash' ? 'Cash on Trip' : 'Online Payment'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Receipt - ${booking.booking_reference}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .logo {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .logo-subtitle {
      font-size: 14px;
      opacity: 0.9;
    }

    .receipt-badge {
      background: ${isPaid ? '#10b981' : '#f59e0b'};
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      display: inline-block;
      margin-top: 20px;
      font-weight: 600;
      font-size: 14px;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
    }

    .section:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 16px;
      color: #1e293b;
      font-weight: 500;
    }

    .route-item {
      display: flex;
      align-items: start;
      gap: 15px;
      margin-bottom: 20px;
    }

    .route-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      flex-shrink: 0;
    }

    .route-icon.pickup {
      background: #10b981;
    }

    .route-icon.dropoff {
      background: #ef4444;
    }

    .route-details {
      flex: 1;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 15px;
    }

    .price-row.total {
      border-top: 2px solid #1e293b;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    .price-row .label {
      color: #64748b;
    }

    .price-row.total .label {
      color: #1e293b;
    }

    .footer {
      background: #f8fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 2px solid #e2e8f0;
    }

    .footer-title {
      font-weight: 600;
      margin-bottom: 10px;
      color: #1e293b;
    }

    .contact-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 14px;
    }

    .print-button {
      background: #1e293b;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.3s;
    }

    .print-button:hover {
      background: #334155;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
      }
      .print-button {
        display: none;
      }
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      .content {
        padding: 20px;
      }
      .header {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">taxisrilanka</div>
      <div class="logo-subtitle">Sri Lanka's Premier Taxi Service</div>
      <div class="receipt-badge">
        ${isPaid ? '✓ PAID' : '⏳ PENDING PAYMENT'}
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Booking Information -->
      <div class="section">
        <div class="section-title">📋 Booking Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Booking Reference</div>
            <div class="info-value">${booking.booking_reference}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Booking Date</div>
            <div class="info-value">${new Date(booking.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">${booking.status.toUpperCase()}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Vehicle</div>
            <div class="info-value">${booking.vehicle_name} (${booking.vehicle_category})</div>
          </div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Full Name</div>
            <div class="info-value">${booking.full_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone Number</div>
            <div class="info-value">${booking.phone}</div>
          </div>
        </div>
      </div>

      <!-- Trip Details -->
      <div class="section">
        <div class="section-title">🚗 Trip Details</div>
        
        <div class="route-item">
          <div class="route-icon pickup">A</div>
          <div class="route-details">
            <div class="info-label">Pickup Location</div>
            <div class="info-value">${booking.pickup_location}</div>
            <div class="info-label" style="margin-top: 8px">Date & Time</div>
            <div class="info-value">${new Date(booking.pickup_date).toLocaleDateString()} at ${booking.pickup_time}</div>
          </div>
        </div>

        <div class="route-item">
          <div class="route-icon dropoff">B</div>
          <div class="route-details">
            <div class="info-label">Dropoff Location</div>
            <div class="info-value">${booking.dropoff_location}</div>
          </div>
        </div>

        <div class="info-grid" style="margin-top: 20px">
          <div class="info-item">
            <div class="info-label">Estimated Distance</div>
            <div class="info-value">${booking.estimated_distance_km} km</div>
          </div>
        </div>

        ${booking.special_requests ? `
        <div class="info-item" style="margin-top: 20px">
          <div class="info-label">Special Requests</div>
          <div class="info-value">${booking.special_requests}</div>
        </div>
        ` : ''}
      </div>

      <!-- Payment Details -->
      <div class="section">
        <div class="section-title">💳 Payment Details</div>
        
        <div class="price-row">
          <span class="label">Rate per KM</span>
          <span>Rs. ${Number(booking.vehicle_price_per_km).toFixed(2)}</span>
        </div>
        
        <div class="price-row">
          <span class="label">Distance (${booking.estimated_distance_km} km)</span>
          <span>Rs. ${Number(booking.total_price).toFixed(2)}</span>
        </div>

        <div class="price-row total">
          <span class="label">Total Amount</span>
          <span>Rs. ${Number(booking.total_price).toLocaleString()}</span>
        </div>

        <div class="info-grid" style="margin-top: 20px">
          <div class="info-item">
            <div class="info-label">Payment Method</div>
            <div class="info-value">${paymentMethod}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Payment Status</div>
            <div class="info-value">${isPaid ? 'PAID' : 'PENDING'}</div>
          </div>
          ${booking.payment_reference ? `
          <div class="info-item">
            <div class="info-label">Payment Reference</div>
            <div class="info-value">${booking.payment_reference}</div>
          </div>
          ` : ''}
          ${booking.onepay_transaction_id ? `
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">${booking.onepay_transaction_id}</div>
          </div>
          ` : ''}
          ${booking.paid_at ? `
          <div class="info-item">
            <div class="info-label">Payment Date</div>
            <div class="info-value">${new Date(booking.paid_at).toLocaleString()}</div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-title">Need Help?</div>
      <p style="color: #64748b; margin-bottom: 10px">
        Contact us for any questions or changes to your booking
      </p>
      <div class="contact-info">
        <div class="contact-item">
          <span>📞</span>
          <span>+94 777 850 529</span>
        </div>
        <div class="contact-item">
          <span>✉️</span>
          <span>info@taxisrilanka.com</span>
        </div>
        <div class="contact-item">
          <span>🌐</span>
          <span>www.taxisrilanka.com</span>
        </div>
      </div>
      <button class="print-button" onclick="window.print()">
        🖨️ Print Receipt
      </button>
    </div>
  </div>
</body>
</html>
  `
}
