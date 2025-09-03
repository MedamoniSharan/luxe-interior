/*
  # Fix cart items RLS policies

  1. Changes
    - Update cart_items RLS policies to use auth.uid() instead of uid()
    - Ensure consistent policy naming and conditions

  2. Security
    - Policies updated to use correct auth.uid() function
    - Maintains existing security model but fixes implementation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert into their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;

-- Recreate policies with correct auth.uid() function
CREATE POLICY "Users can delete their own cart items"
ON cart_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart"
ON cart_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON cart_items FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cart items"
ON cart_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);