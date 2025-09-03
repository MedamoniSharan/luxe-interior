/*
  # Add categories table and sample data

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on categories table
    - Add policy for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('TV Units', 'tv-units', 'Modern TV units with storage and display solutions'),
  ('Living Room', 'living-room', 'Complete living room interior design solutions'),
  ('Kitchen Designs', 'kitchen', 'Modern modular kitchen designs'),
  ('Show Cases', 'showcases', 'Display and storage solutions'),
  ('Bedroom', 'bedroom', 'Complete bedroom interior solutions'),
  ('Study Room', 'study-room', 'Functional study and work space designs'),
  ('Dining Room', 'dining-room', 'Elegant dining room solutions'),
  ('Wardrobe', 'wardrobe', 'Custom wardrobe and storage solutions'),
  ('Kids Room', 'kids-room', 'Fun and functional kids room designs');

-- Add foreign key to products table
ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id);