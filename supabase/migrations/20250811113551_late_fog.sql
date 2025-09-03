/*
  # Add Sample Products for Testing

  1. New Products
    - Add sample products to the products table
    - Include various categories and sections
    - Ensure proper data structure

  2. Data
    - TV Units, Living Room, Kitchen, Bedroom, Showcases
    - Mix of regular and top-rated products
    - Realistic pricing and descriptions
*/

-- Insert sample products if the table is empty
INSERT INTO products (title, description, price_per_sqft, category, images, material_type, warranty, origin, section)
SELECT * FROM (VALUES
  (
    'Modern TV Unit with Storage',
    'Sleek and contemporary TV unit with ample storage space. Features clean lines and premium finish.',
    850.00,
    'tv-units',
    ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg'],
    'Engineered Wood',
    '5 Years',
    'Made in India',
    'top-rated'
  ),
  (
    'Luxury Living Room Set',
    'Complete living room furniture set with sofa, coffee table, and side tables. Premium upholstery and finish.',
    1200.00,
    'living-room',
    ARRAY['https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', 'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg'],
    'Solid Wood',
    '7 Years',
    'Made in India',
    'services'
  ),
  (
    'Modular Kitchen Design',
    'Complete modular kitchen with cabinets, countertops, and storage solutions. Modern and functional design.',
    950.00,
    'kitchen',
    ARRAY['https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg', 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg'],
    'Marine Plywood',
    '10 Years',
    'Made in India',
    'top-rated'
  ),
  (
    'Elegant Bedroom Suite',
    'Complete bedroom furniture including bed, wardrobe, and side tables. Elegant design with premium finish.',
    1100.00,
    'bedroom',
    ARRAY['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg'],
    'Solid Wood',
    '8 Years',
    'Made in India',
    'services'
  ),
  (
    'Designer Showcase Unit',
    'Beautiful showcase unit for displaying decorative items. Features glass shelves and LED lighting.',
    750.00,
    'showcases',
    ARRAY['https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg', 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg'],
    'Engineered Wood',
    '5 Years',
    'Made in India',
    'top-rated'
  ),
  (
    'Contemporary TV Wall Unit',
    'Wall-mounted TV unit with floating design. Includes cable management and storage compartments.',
    920.00,
    'tv-units',
    ARRAY['https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg', 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg'],
    'MDF',
    '5 Years',
    'Made in India',
    'services'
  ),
  (
    'Premium Sofa Set',
    'Luxurious 3-seater sofa set with premium fabric upholstery. Comfortable and stylish design.',
    1350.00,
    'living-room',
    ARRAY['https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg', 'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg'],
    'Hardwood Frame',
    '6 Years',
    'Made in India',
    'top-rated'
  ),
  (
    'Smart Kitchen Cabinets',
    'Intelligent kitchen cabinet system with soft-close hinges and pull-out drawers. Space-efficient design.',
    880.00,
    'kitchen',
    ARRAY['https://images.pexels.com/photos/1599792/pexels-photo-1599792.jpeg', 'https://images.pexels.com/photos/2062427/pexels-photo-2062427.jpeg'],
    'Plywood',
    '8 Years',
    'Made in India',
    'services'
  )
) AS sample_data(title, description, price_per_sqft, category, images, material_type, warranty, origin, section)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);