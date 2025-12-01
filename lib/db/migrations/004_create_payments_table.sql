
-- Create payments table to track all payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  onepay_transaction_id VARCHAR(100) UNIQUE,
  reference_number VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'LKR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  redirect_url TEXT,
  callback_data JSONB,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_onepay_transaction_id ON payments(onepay_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add comment
COMMENT ON TABLE payments IS 'Payment transaction records for bookings';
