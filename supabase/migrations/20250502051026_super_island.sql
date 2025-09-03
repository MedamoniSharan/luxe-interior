/*
  # Add section column and notes for cart items

  1. Changes
    - Add section column to products table
    - Add notes column to cart_items table
    - Update existing products with default section value

  2. Security
    - Maintain existing RLS policies
*/

-- Add section column to products table
ALTER TABLE products ADD COLUMN section text DEFAULT 'services';

-- Add notes column to cart_items table
ALTER TABLE cart_items ADD COLUMN notes text;

-- Update existing products to have 'services' section
UPDATE products SET section = 'services' WHERE section IS NULL;