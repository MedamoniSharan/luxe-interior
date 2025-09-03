/*
  # Fix Users Table RLS Policies

  1. Security Changes
    - Add INSERT policy for users table to allow new user registration
    - Policy ensures users can only insert rows where their auth.uid matches the user id

  Note: Existing SELECT policy is already correctly configured
*/

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);