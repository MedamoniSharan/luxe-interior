/*
  # Add transaction history table for comprehensive payment tracking

  1. New Tables
    - `transaction_history`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `user_id` (uuid, foreign key to users)
      - `transaction_id` (text, unique)
      - `payment_method` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `gateway_response` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on transaction_history table
    - Add policies for authenticated users to view their own transactions
    - Add policies for creating transactions

  3. Indexes
    - Add indexes for better query performance
*/

-- Create transaction_history table
CREATE TABLE IF NOT EXISTS transaction_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  transaction_id text UNIQUE NOT NULL,
  payment_method text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transaction_history ENABLE ROW LEVEL SECURITY;

-- Create policies for transaction_history
CREATE POLICY "Users can view their own transactions"
  ON transaction_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON transaction_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can create transactions"
  ON transaction_history
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can update their own transactions"
  ON transaction_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_transaction_history_user_id ON transaction_history(user_id);
CREATE INDEX idx_transaction_history_order_id ON transaction_history(order_id);
CREATE INDEX idx_transaction_history_transaction_id ON transaction_history(transaction_id);
CREATE INDEX idx_transaction_history_status ON transaction_history(status);
CREATE INDEX idx_transaction_history_created_at ON transaction_history(created_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transaction_history_updated_at
    BEFORE UPDATE ON transaction_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
