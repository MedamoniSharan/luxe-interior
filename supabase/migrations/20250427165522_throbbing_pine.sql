/*
  # Fix cart items RLS policy

  1. Changes
    - Drop existing RLS policy for cart_items
    - Add separate policies for INSERT, SELECT, UPDATE, and DELETE operations
    - Ensure authenticated users can manage their own cart items
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;

-- Create separate policies for better control
CREATE POLICY "Users can insert into their own cart"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);