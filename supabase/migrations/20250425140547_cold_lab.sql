/*
  # Add sample products

  1. Changes
    - Insert sample products into the products table with realistic data
    - Includes various categories: TV Units, Living Room, Kitchen, Show Cases, Bedroom
    - Each product has complete details including material type, warranty, and origin
*/

INSERT INTO products (title, description, price_per_sqft, category, images, material_type, warranty, origin)
VALUES
  (
    'Modern Floating TV Unit',
    'Premium floating TV unit with ambient LED lighting and concealed wiring system. Features soft-close drawers and tempered glass shelves. Perfect for modern living rooms.',
    2200,
    'tv-units',
    ARRAY[
      'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg',
      'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg'
    ],
    'High-grade MDF with Oak Veneer',
    '5 Years Manufacturer Warranty',
    'Made in India'
  ),
  (
    'Contemporary Living Room Set',
    'Complete living room solution featuring a sleek entertainment unit, floating shelves, and accent lighting. Includes storage compartments and display areas.',
    2800,
    'living-room',
    ARRAY[
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg'
    ],
    'Premium MDF with Walnut Finish',
    '5 Years Warranty on Hardware',
    'Made in India'
  ),
  (
    'Modular Kitchen System',
    'Modern modular kitchen with quartz countertop, soft-close cabinets, and built-in organizers. Features anti-bacterial coating and premium hardware.',
    3200,
    'kitchen',
    ARRAY[
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
    ],
    'Marine Grade Plywood with Laminate',
    '10 Years Warranty on Cabinets',
    'Made in India'
  ),
  (
    'Glass Display Showcase',
    'Elegant glass showcase with LED spotlights and toughened glass shelves. Perfect for displaying collectibles and decorative items.',
    1950,
    'showcases',
    ARRAY[
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg',
      'https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg'
    ],
    'Toughened Glass with Aluminum Frame',
    '3 Years Warranty',
    'Made in India'
  ),
  (
    'Master Bedroom Suite',
    'Complete bedroom solution including wardrobe, bed-back unit, and side tables. Features mirror finish and mood lighting.',
    2600,
    'bedroom',
    ARRAY[
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      'https://images.pexels.com/photos/3773575/pexels-photo-3773575.png'
    ],
    'Premium MDF with PU Finish',
    '5 Years Warranty',
    'Made in India'
  ),
  (
    'Wall-Mounted TV Console',
    'Minimalist wall-mounted TV console with hidden storage and cable management. Features push-to-open drawers.',
    1800,
    'tv-units',
    ARRAY[
      'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
      'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg'
    ],
    'Engineered Wood with Laminate',
    '3 Years Warranty',
    'Made in India'
  ),
  (
    'L-Shaped Kitchen Design',
    'Space-efficient L-shaped kitchen with breakfast counter. Includes tall unit for storage and appliances.',
    3500,
    'kitchen',
    ARRAY[
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg'
    ],
    'BWP Plywood with Acrylic Finish',
    '7 Years Warranty',
    'Made in India'
  ),
  (
    'Designer Wardrobe System',
    'Floor-to-ceiling wardrobe with sliding doors and internal organizers. Features LED lighting and full-length mirrors.',
    2400,
    'bedroom',
    ARRAY[
      'https://images.pexels.com/photos/3773575/pexels-photo-3773575.png',
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'
    ],
    'High-grade MDF with Mirror Finish',
    '5 Years Warranty',
    'Made in India'
  );