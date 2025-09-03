/*
  # Add payment fields to orders table

  1. Changes
    - Add Razorpay payment fields to orders table
    - Add indexes for payment IDs

  2. Security
    - Maintain existing RLS policies
*/

-- Add payment fields to orders table
ALTER TABLE orders
ADD COLUMN razorpay_payment_id text,
ADD COLUMN razorpay_order_id text;

-- Add indexes for payment IDs
CREATE INDEX idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);