/*
  # Fix addresses table RLS policies

  1. Changes
    - Drop existing ALL policy
    - Create separate policies for INSERT, SELECT, UPDATE, and DELETE operations
    - Ensure proper user_id checks for each operation

  2. Security
    - Enable RLS (already enabled)
    - Add specific policies for each operation type
    - Ensure users can only manage their own addresses
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage their own addresses" ON addresses;

-- Create separate policies for each operation
CREATE POLICY "Users can insert their own addresses"
ON addresses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own addresses"
ON addresses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON addresses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON addresses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);