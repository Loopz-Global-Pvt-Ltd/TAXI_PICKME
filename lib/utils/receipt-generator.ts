export function generateReceiptHTML(booking: any, payment?: any): string {
  const isPaid = booking.payment_status === 'paid' || payment?.status === 'paid' || payment?.status === 'completed'
  const paymentMethod = booking.payment_method === 'cash' ? 'Cash on Trip' : 'Online Payment'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${booking.booking_reference || booking.id}</title>
  <style>
    @page { size: A4; margin: 0; }
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #000;
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      border: 2px solid #000;
      padding: 30px;
      margin-bottom: 30px;
    }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { font-size: 14px; margin-bottom: 20px; }
    .status-badge {
      display: inline-block;
      border: 2px solid #000;
      padding: 8px 20px;
      font-weight: bold;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 2px solid #000;
    }
    .section:last-of-type { border-bottom: none; }
    .section h2 { font-size: 18px; margin-bottom: 20px; font-weight: bold; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-item { margin-bottom: 15px; }
    .info-label {
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value { font-size: 16px; font-weight: 500; }
    .location-box { border: 1px solid #000; padding: 15px; margin-bottom: 20px; }
    .payment-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .payment-table td { padding: 12px 0; font-size: 15px; }
    .payment-table .total-row td {
      border-top: 2px solid #000;
      padding-top: 15px;
      font-size: 20px;
      font-weight: bold;
    }
    .payment-table .total-row td:last-child { text-align: right; }
    .footer {
      text-align: center;
      border-top: 2px solid #000;
      padding-top: 30px;
      margin-top: 30px;
    }
    .footer h3 { font-size: 16px; margin-bottom: 10px; }
    .footer p { font-size: 14px; margin-bottom: 15px; }
    .contact-info { font-size: 14px; line-height: 1.8; }
    .action-buttons {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
    }
    .btn {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s;
    }
    .btn-primary {
      background: #000;
      color: #fff;
    }
    .btn-primary:hover {
      background: #333;
    }
    .btn-secondary {
      background: #fff;
      color: #000;
      border: 2px solid #000;
    }
    .btn-secondary:hover {
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <div class="action-buttons no-print">
    <button class="btn btn-secondary" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn btn-primary" onclick="window.close()">✕ Close</button>
  </div>

  <div class="header">
    <h1>taxisrilanka</h1>
    <p>Sri Lanka's Premier Taxi Service</p>
    <div class="status-badge">${isPaid ? '✓ PAID' : '⏳ PENDING PAYMENT'}</div>
  </div>

  <div class="section">
    <h2>📋 Booking Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Booking Reference</div>
        <div class="info-value">${booking.booking_reference || `#${booking.id}`}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Booking Date</div>
        <div class="info-value">${new Date(booking.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${booking.status?.toUpperCase() || 'CONFIRMED'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>👤 Customer Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Full Name</div>
        <div class="info-value">${booking.full_name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Phone Number</div>
        <div class="info-value">${booking.phone}</div>
      </div>
      ${booking.email ? `
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${booking.email}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <h2>🚗 Trip Details</h2>
    
    <div class="location-box">
      <div class="info-label">📍 Pickup Location (A)</div>
      <div class="info-value" style="margin-bottom: 8px;">${booking.pickup_location}</div>
      <div style="font-size: 14px; color: #555;">📅 ${new Date(booking.pickup_date).toLocaleDateString()} at ${booking.pickup_time}</div>
    </div>

    <div class="location-box">
      <div class="info-label">🎯 Dropoff Location (B)</div>
      <div class="info-value">${booking.dropoff_location}</div>
    </div>

    <div class="info-item">
      <div class="info-label">Distance</div>
      <div class="info-value">${booking.estimated_distance_km} km</div>
    </div>

    ${booking.special_requests ? `
    <div class="info-item" style="margin-top: 20px;">
      <div class="info-label">Special Requests</div>
      <div class="info-value">${booking.special_requests}</div>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <h2>💳 Payment Details</h2>
    
    <table class="payment-table">
      <tr>
        <td>Total Distance</td>
        <td style="text-align: right;">${booking.estimated_distance_km} km</td>
      </tr>
      <tr class="total-row">
        <td>Total Amount</td>
        <td>Rs. ${Number(booking.total_price).toLocaleString()}</td>
      </tr>
    </table>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Payment Method</div>
        <div class="info-value">${paymentMethod}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Payment Status</div>
        <div class="info-value">${isPaid ? 'PAID ✓' : 'PENDING ⏳'}</div>
      </div>
      ${payment?.reference_number ? `
      <div class="info-item">
        <div class="info-label">Payment Reference</div>
        <div class="info-value">${payment.reference_number}</div>
      </div>
      ` : ''}
      ${payment?.onepay_transaction_id ? `
      <div class="info-item">
        <div class="info-label">Transaction ID</div>
        <div class="info-value">${payment.onepay_transaction_id}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="footer">
    <h3>Need Help?</h3>
    <p>Contact us for any questions or changes to your booking</p>
    <div class="contact-info">
      <div>📞 +94 777 850 529</div>
      <div>✉️ sritaxi@gmail.com</div>
      <div>🌐 www.taxisrilanka.com</div>
    </div>
  </div>

  <script>
    // Auto-focus for better print experience
    window.onload = function() {
      // Show helpful message
      console.log('Receipt loaded. Click "Print / Save as PDF" button or use Ctrl+P (Cmd+P on Mac)');
    }
  </script>
</body>
</html>
  `
}

export function downloadReceipt(booking: any, payment?: any) {
  try {
    // Generate the HTML content
    const htmlContent = generateReceiptHTML(booking, payment)
    
    // Create blob and download as HTML
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    a.href = url
    a.download = `receipt-${booking.booking_reference || booking.id}.html`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 100)
    
    // Also open in new tab for immediate viewing/printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
    }
    
  } catch (error: any) {
    console.error('Receipt generation error:', error)
    alert('Failed to generate receipt. Please try again.')
  }
}

// Alternative: View receipt in same page
export function viewReceipt(booking: any, payment?: any) {
  const htmlContent = generateReceiptHTML(booking, payment)
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}