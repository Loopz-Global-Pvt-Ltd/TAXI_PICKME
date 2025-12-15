interface BookingEmailData {
    bookingReference: string
    fullName: string
    email: string
    phone: string
    pickupLocation: string
    dropoffLocation: string
    pickupDate: string
    pickupTime: string
    vehicleName: string
    vehicleCategory: string
    distanceKm: number
    totalPrice: number
    specialRequests?: string
    tripType?: string
  }
  
  export function generateBookingConfirmationEmail(data: BookingEmailData): string {
    const isReturnTrip = data.tripType === 'Return Trip'
    
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚖 Taxi Sri Lanka Tours</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
              </td>
            </tr>
  
            <!-- Success Message -->
            <tr>
              <td style="padding: 30px; text-align: center;">
                <div style="background-color: #10B981; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                  <h2 style="margin: 0; font-size: 20px;">✓ Booking Confirmed!</h2>
                </div>
                <p style="color: #666666; margin: 20px 0 0 0; font-size: 14px;">
                  Thank you for choosing Taxi Sri Lanka. Your booking has been confirmed.
                </p>
              </td>
            </tr>
  
            <!-- Booking Reference -->
            <tr>
              <td style="padding: 0 30px 20px 30px;">
                <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px;">
                  <p style="margin: 0; color: #92400E; font-size: 14px;">
                    <strong>Booking Reference:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; color: #92400E; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                    ${data.bookingReference}
                  </p>
                </div>
              </td>
            </tr>
  
            <!-- Customer Details -->
            <tr>
              <td style="padding: 0 30px 20px 30px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                  👤 Customer Details
                </h3>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; width: 40%;"><strong>Name:</strong></td>
                    <td style="color: #333333; font-size: 14px;">${data.fullName}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Email:</strong></td>
                    <td style="color: #333333; font-size: 14px;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Phone:</strong></td>
                    <td style="color: #333333; font-size: 14px;">${data.phone}</td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- Trip Details -->
            <tr>
              <td style="padding: 0 30px 20px 30px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                  🚗 Trip Details
                </h3>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; width: 40%;"><strong>Pickup:</strong></td>
                    <td style="color: #333333; font-size: 14px;">📍 ${data.pickupLocation}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Drop-off:</strong></td>
                    <td style="color: #333333; font-size: 14px;">📍 ${data.dropoffLocation}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Date:</strong></td>
                    <td style="color: #333333; font-size: 14px;">📅 ${new Date(data.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Time:</strong></td>
                    <td style="color: #333333; font-size: 14px;">🕒 ${data.pickupTime}</td>
                  </tr>

                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Distance:</strong></td>
                    <td style="color: #333333; font-size: 14px;">📏 ${data.distanceKm} km ${isReturnTrip ? `(${data.distanceKm * 2} km round trip)` : ''}</td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- Vehicle Details -->
            <tr>
              <td style="padding: 0 30px 20px 30px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                  🚙 Vehicle Details
                </h3>
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #666666; font-size: 14px; width: 40%;"><strong>Vehicle:</strong></td>
                    <td style="color: #333333; font-size: 14px;">${data.vehicleName}</td>
                  </tr>
                  <tr>
                    <td style="color: #666666; font-size: 14px;"><strong>Category:</strong></td>
                    <td style="color: #333333; font-size: 14px;">${data.vehicleCategory}</td>
                  </tr>
                </table>
              </td>
            </tr>
  
            ${data.specialRequests ? `
            <!-- Special Requests -->
            <tr>
              <td style="padding: 0 30px 20px 30px;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #000000; padding-bottom: 10px;">
                  📝 Special Requests
                </h3>
                <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.6;">
                  ${data.specialRequests}
                </p>
              </td>
            </tr>
            ` : ''}
  
            <!-- Pricing -->
            <tr>
              <td style="padding: 0 30px 30px 30px;">
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px;">
                  <table width="100%" cellpadding="5" cellspacing="0">
                    <tr>
                      <td style="color: #333333; font-size: 16px; font-weight: bold;">Total Amount:</td>
                      <td style="color: #10B981; font-size: 24px; font-weight: bold; text-align: right;">
                        LKR ${data.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top: 10px;">
                        <p style="color: #EF4444; font-size: 14px; margin: 0; text-align: center;">
                          ⚠️ Payment Status: <strong>Pending</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
  
            <!-- Important Notes -->
            <tr>
              <td style="padding: 0 30px 30px 30px;">
                <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px;">
                  <h4 style="color: #1E40AF; margin: 0 0 10px 0; font-size: 16px;">📌 Important Information</h4>
                  <ul style="color: #1E3A8A; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Please arrive 10 minutes before pickup time</li>
                    <li>Driver contact details will be sent 24 hours before pickup</li>
                    <li>Keep your booking reference handy</li>
                    <li>For changes or cancellations, contact us immediately</li>
                  </ul>
                </div>
              </td>
            </tr>
  
            <!-- Contact Information -->
            <tr>
              <td style="padding: 0 30px 30px 30px; text-align: center;">
                <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                  Need help? Contact us:
                </p>
                <p style="color: #333333; font-size: 14px; margin: 0;">
                  📞 <strong>+94 +94 777 850 529</strong> | 
                  📧 <strong>sritaxi@gmail.com</strong>
                </p>
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 12px; margin: 0 0 5px 0;">
                  © ${new Date().getFullYear()} Taxi Sri Lanka. All rights reserved.
                </p>
                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                  <a href="https://taxisrilanka.com" style="color: #3B82F6; text-decoration: none;">Visit our website</a>
                </p>
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `
  }
  
  export function generateBookingConfirmationText(data: BookingEmailData): string {
    const isReturnTrip = data.tripType === 'Return Trip'
    
    return `
  BOOKING CONFIRMATION - TAXI SRI LANKA
  ======================================
  
  ✓ Your booking has been confirmed!
  
  BOOKING REFERENCE: ${data.bookingReference}
  
  CUSTOMER DETAILS
  ----------------
  Name: ${data.fullName}
  Email: ${data.email}
  Phone: ${data.phone}
  
  TRIP DETAILS
  ------------
  Pickup: ${data.pickupLocation}
  Drop-off: ${data.dropoffLocation}
  Date: ${new Date(data.pickupDate).toLocaleDateString()}
  Time: ${data.pickupTime}
  Distance: ${data.distanceKm} km ${isReturnTrip ? `(${data.distanceKm * 2} km round trip)` : ''}
  
  VEHICLE DETAILS
  ---------------
  Vehicle: ${data.vehicleName}
  Category: ${data.vehicleCategory}
  
  ${data.specialRequests ? `SPECIAL REQUESTS\n----------------\n${data.specialRequests}\n\n` : ''}
  
  TOTAL AMOUNT: LKR ${data.totalPrice.toLocaleString()}
  Payment Status: PENDING
  
  IMPORTANT INFORMATION
  ---------------------
  - Arrive 10 minutes before pickup time
  - Driver details will be sent 24 hours before pickup
  - Keep your booking reference handy
  - Contact us for changes or cancellations
  
  CONTACT US
  ----------
  Phone: +94 +94 777 850 529
  Email: sritaxi@gmail.com
  Website: https://taxisrilanka.com
  
  Thank you for choosing Taxi Sri Lanka!
    `.trim()
  }








  
export function generateAdminBookingNotificationEmail(data: BookingEmailData): string {
  const isReturnTrip = data.tripType === 'Return Trip'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔔 New Booking Alert</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Taxi Sri Lanka Tours - Admin Panel</p>
            </td>
          </tr>

          <!-- Alert Message -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; padding: 15px; border-radius: 8px; display: inline-block;">
                <h2 style="margin: 0; font-size: 20px; color: #92400E;">🚨 Action Required: New Booking Received!</h2>
              </div>
              <p style="color: #666666; margin: 20px 0 0 0; font-size: 14px;">
                A new booking has been created. Please review and confirm.
              </p>
            </td>
          </tr>

          <!-- Booking Reference -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background-color: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #1E40AF; font-size: 14px;">
                  <strong>Booking Reference:</strong>
                </p>
                <p style="margin: 5px 0 0 0; color: #1E40AF; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                  ${data.bookingReference}
                </p>
              </div>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
                👤 Customer Information
              </h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #F9FAFB; border-radius: 4px;">
                <tr>
                  <td style="color: #666666; font-size: 14px; width: 35%; padding: 8px;"><strong>Name:</strong></td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; padding: 8px;">${data.fullName}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Email:</strong></td>
                  <td style="color: #333333; font-size: 14px; padding: 8px;">
                    <a href="mailto:${data.email}" style="color: #3B82F6; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Phone:</strong></td>
                  <td style="color: #333333; font-size: 14px; padding: 8px;">
                    <a href="tel:${data.phone}" style="color: #10B981; text-decoration: none; font-weight: bold;">${data.phone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
                🚗 Trip Information
              </h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #F9FAFB; border-radius: 4px;">
                <tr>
                  <td style="color: #666666; font-size: 14px; width: 35%; padding: 8px;"><strong>Pickup:</strong></td>
                  <td style="color: #333333; font-size: 14px; padding: 8px;">📍 ${data.pickupLocation}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Drop-off:</strong></td>
                  <td style="color: #333333; font-size: 14px; padding: 8px;">📍 ${data.dropoffLocation}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Date & Time:</strong></td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; padding: 8px;">
                    📅 ${new Date(data.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    <br/>🕒 ${data.pickupTime}
                  </td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #333333; font-size: 14px; padding: 8px;">
                    <span style="background-color: ${isReturnTrip ? '#DBEAFE' : '#D1FAE5'}; color: ${isReturnTrip ? '#1E40AF' : '#065F46'}; padding: 4px 12px; border-radius: 12px; font-weight: bold;">
                      ${isReturnTrip ? '↔️ Return Trip' : '→ One Way'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Distance:</strong></td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; padding: 8px;">
                    📏 ${data.distanceKm} km ${isReturnTrip ? `<span style="color: #EF4444;">(${data.distanceKm * 2} km total)</span>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Vehicle Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
                🚙 Vehicle Assignment
              </h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #F9FAFB; border-radius: 4px;">
                <tr>
                  <td style="color: #666666; font-size: 14px; width: 35%; padding: 8px;"><strong>Vehicle:</strong></td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; padding: 8px;">${data.vehicleName}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #666666; font-size: 14px; padding: 8px;"><strong>Category:</strong></td>
                  <td style="color: #333333; font-size: 14px; padding: 8px;">${data.vehicleCategory}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${data.specialRequests ? `
          <!-- Special Requests -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
                📝 Special Requests
              </h3>
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px;">
                <p style="color: #92400E; font-size: 14px; margin: 0; line-height: 1.6; font-weight: 500;">
                  ${data.specialRequests}
                </p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Pricing Summary -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #DCFCE7; border: 2px solid #10B981; padding: 20px; border-radius: 8px;">
                <table width="100%" cellpadding="5" cellspacing="0">
                  <tr>
                    <td style="color: #065F46; font-size: 16px; font-weight: bold;">💰 Total Booking Value:</td>
                    <td style="color: #065F46; font-size: 28px; font-weight: bold; text-align: right;">
                      LKR ${data.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 10px;">
                      <p style="color: #EF4444; font-size: 14px; margin: 0; text-align: center; font-weight: bold;">
                        ⚠️ Payment Status: PENDING
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Action Items -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px;">
                <h4 style="color: #1E40AF; margin: 0 0 10px 0; font-size: 16px;">✅ Next Steps:</h4>
                <ol style="color: #1E3A8A; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Confirm vehicle availability for the requested date and time</li>
                  <li>Assign a driver to this booking</li>
                  <li>Send driver details to customer 24 hours before pickup</li>
                  <li>Follow up on payment status</li>
                  <li>Contact customer if any clarifications needed</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Quick Actions -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 5px;">
                    <a href="tel:${data.phone}" style="display: block; background-color: #10B981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                      📞 Call Customer
                    </a>
                  </td>
                  <td style="padding: 0 5px;">
                    <a href="mailto:${data.email}" style="display: block; background-color: #3B82F6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                      📧 Email Customer
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
                🕐 Booking received at: ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'long',
                  timeZone: 'Asia/Colombo' 
                })}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 12px; margin: 0 0 5px 0;">
                This is an automated notification from Taxi Sri Lanka Booking System
              </p>
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                <a href="https://taxisrilanka.com/admin" style="color: #3B82F6; text-decoration: none;">Access Admin Dashboard</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateAdminBookingNotificationText(data: BookingEmailData): string {
  const isReturnTrip = data.tripType === 'Return Trip'
  
  return `
🔔 NEW BOOKING ALERT - TAXI SRI LANKA
======================================

⚠️ ACTION REQUIRED: New booking has been received!

BOOKING REFERENCE: ${data.bookingReference}

CUSTOMER INFORMATION
--------------------
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}

TRIP INFORMATION
----------------
Pickup: ${data.pickupLocation}
Drop-off: ${data.dropoffLocation}
Date: ${new Date(data.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${data.pickupTime}
Distance: ${data.distanceKm} km ${isReturnTrip ? `(${data.distanceKm * 2} km total)` : ''}

VEHICLE ASSIGNMENT
------------------
Vehicle: ${data.vehicleName}
Category: ${data.vehicleCategory}

${data.specialRequests ? `SPECIAL REQUESTS\n----------------\n${data.specialRequests}\n\n` : ''}

BOOKING VALUE
-------------
Total Amount: LKR ${data.totalPrice.toLocaleString()}
Payment Status: PENDING

NEXT STEPS
----------
1. Confirm vehicle availability
2. Assign a driver
3. Send driver details 24 hours before pickup
4. Follow up on payment
5. Contact customer if needed

QUICK ACTIONS
-------------
Call Customer: ${data.phone}
Email Customer: ${data.email}

Booking Timestamp: ${new Date().toLocaleString('en-US', { 
  dateStyle: 'full', 
  timeStyle: 'long',
  timeZone: 'Asia/Colombo' 
})}

---
This is an automated notification from Taxi Sri Lanka Booking System
  `.trim()
}