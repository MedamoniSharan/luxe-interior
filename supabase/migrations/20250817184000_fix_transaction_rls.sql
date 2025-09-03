/*
  # Fix RLS Policy for Transaction History
  
  The current RLS policy only allows authenticated users to create transactions,
  but Edge Functions run with service_role and need to be able to insert records.
  
  This migration adds a policy that allows the service_role to create transactions.
*/

-- Add policy for service role to create transactions
CREATE POLICY "Service role can create transactions"
  ON transaction_history
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'transaction_history';
