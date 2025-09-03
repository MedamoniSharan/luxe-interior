/*
  # Create items table to replace products table

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `price_per_sqft` (numeric, not null)
      - `category` (text, not null)
      - `images` (text array, not null)
      - `material_type` (text, not null)
      - `warranty` (text, not null)
      - `origin` (text, not null)
      - `created_at` (timestamp with time zone)
      - `category_id` (uuid, foreign key to categories)
      - `section` (text, default 'services')

  2. Security
    - Enable RLS on `items` table
    - Add policy for anyone to read items (for public access)

  3. Data Migration
    - Copy all data from existing `products` table to new `items` table
    - Update foreign key references in other tables
    - Drop old `products` table after migration
*/

-- Create the new 'items' table
CREATE TABLE IF NOT EXISTS public.items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price_per_sqft numeric NOT NULL,
    category text NOT NULL,
    images text[] NOT NULL,
    material_type text NOT NULL,
    warranty text NOT NULL,
    origin text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    category_id uuid,
    section text DEFAULT 'services'::text
);

-- Add primary key constraint
ALTER TABLE public.items ADD CONSTRAINT items_pkey PRIMARY KEY (id);

-- Add foreign key constraint to categories table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        ALTER TABLE public.items ADD CONSTRAINT items_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES public.categories(id);
    END IF;
END $$;

-- Copy data from products table to items table (if products table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        INSERT INTO public.items (id, title, description, price_per_sqft, category, images, material_type, warranty, origin, created_at, category_id, section)
        SELECT id, title, description, price_per_sqft, category, images, material_type, warranty, origin, created_at, category_id, section
        FROM public.products;
    END IF;
END $$;

-- Update foreign key references in other tables
DO $$
BEGIN
    -- Update cart_items table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        -- Drop existing foreign key constraint
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_items_product_id_fkey') THEN
            ALTER TABLE public.cart_items DROP CONSTRAINT cart_items_product_id_fkey;
        END IF;
        -- Rename column from product_id to item_id
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'product_id') THEN
            ALTER TABLE public.cart_items RENAME COLUMN product_id TO item_id;
        END IF;
        -- Add new foreign key constraint
        ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_item_id_fkey 
        FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;
    END IF;

    -- Update order_items table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
        -- Drop existing foreign key constraint
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'order_items_product_id_fkey') THEN
            ALTER TABLE public.order_items DROP CONSTRAINT order_items_product_id_fkey;
        END IF;
        -- Rename column from product_id to item_id
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_id') THEN
            ALTER TABLE public.order_items RENAME COLUMN product_id TO item_id;
        END IF;
        -- Add new foreign key constraint
        ALTER TABLE public.order_items ADD CONSTRAINT order_items_item_id_fkey 
        FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read items" ON public.items
    FOR SELECT USING (true);

-- Insert sample data if table is empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM public.items) = 0 THEN
        INSERT INTO public.items (id, title, description, price_per_sqft, category, images, material_type, warranty, origin, created_at, category_id, section) VALUES 
        ('050d87a6-f26e-4c85-9793-c7ff68fc7a44', 'Black Metal Divider', 'Black metal dividers are a suitable way to create a little sleek and modernistic way to enhance an already beautiful home. The illusion of movement from the metal slats even adds a whimsical flair.', 700, 'partations', '{"https://www.recommend.my/blog/wp-content/uploads/2021/03/image10.png","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Metal', '12 Years', 'Made in India', '2025-05-02 05:57:37.900162+00', null, 'top-rated'),
        ('0f348691-8963-4935-b180-24fa4ca7668f', 'L-Shaped Kitchen Design', 'Space-efficient L-shaped kitchen with breakfast counter. Includes tall unit for storage and appliances.', 1200, 'kitchen', '{"https://images.livspace-cdn.com/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-1657179080-NnXAg/kitchen-1657189966-XPfvA/12-1-1-1662536901-VyzAM.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'BWP Plywood with Acrylic Finish', '7 Years Warranty', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'top-rated'),
        ('15927837-d858-47d1-ad78-3b23564dafed', 'Kitchen Cupboard Design', 'Modular kitchen design which will elevate your home', 900, 'kitchen', '{"https://images.livspace-cdn.com/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-1657179080-NnXAg/kitchen-1657189966-XPfvA/11-3-1-1664365168-dzI3e.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'STEEL', 'NA', 'INDIA', '2025-05-01 16:58:00.301569+00', null, 'services'),
        ('19e7a372-aa48-43f7-bb8c-0f90784c280a', 'Living Room Partitions', 'Modern living room partition designs', 1400, 'partitions', '{"https://i.pinimg.com/originals/ed/a9/ee/eda9ee7e5f6fad31e82723da0025382e.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Plywood', '12 years', 'Made in India', '2025-05-02 05:52:33.035454+00', null, 'top-rated'),
        ('2b39157d-0546-49c2-8931-9cd57f733b19', 'Wooden Partition Ideas for Living Room', 'wooden partition walls for living rooms are a perfect way to enhance the functionality and aesthetics of the area—these partitions separate spaces without blocking the light and airflow of the space.', 1000, 'partitions', '{"https://www.nobroker.in/blog/wp-content/uploads/2024/02/wooden-partition-walls-for-living-room.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Wood', '5 years', 'Made in India', '2025-05-02 06:03:49.634475+00', null, 'services'),
        ('450e4151-223b-45bf-b4fe-ef6ae01fe23b', 'Contemporary Living Room Set', 'Complete living room solution featuring a sleek entertainment unit, floating shelves, and accent lighting.', 899, 'living-room', '{"https://www.primeclassicdesign.com/images/leather-living-room-sets/camel-seats-dark-brown-arms-luxury-sofa-set-e-1368.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Premium MDF with Walnut Finish', '5 Years Warranty on Hardware', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'services'),
        ('90c84bd0-f4d9-4a68-ac33-339eee93fe08', 'Wall-Mounted TV Console', 'Minimalist wall-mounted TV console with hidden storage and cable management. Features push-to-open drawers.', 1000, 'tv-units', '{"https://images.livspace-cdn.com/w:1440/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-1657179080-NnXAg/tv-unit-1657603921-6y6tm/2-16-1-1-1658843488-h2X33.jpg","https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Engineered Wood with Laminate', '3 Years Warranty', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'services'),
        ('aafe69e6-82f4-4735-8762-09c1a5491889', 'Contemporary Compact Floating TV Unit Design', 'A compact TV unit design that is easy to maintain. The wall-mounted TV console unit has ample storage to place your TV accessories.', 1467, 'tv-units', '{"https://images.livspace-cdn.com/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-1657179080-NnXAg/tv-unit-1657603921-6y6tm/35-min-1664281884-AZ93x.jpg","https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'High-grade MDF with Oak Veneer', '5 Years Manufacturer Warranty', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'services'),
        ('b639af39-ff2c-408b-99a9-2f610e86a971', 'Bedroom Cupboard Designs', 'Floor-to-ceiling wardrobe with sliding doors and internal organizers. Features LED lighting and full-length mirrors.', 999, 'bedroom', '{"https://tse3.mm.bing.net/th?id=OIP.pMZYNcCWCU3CYpuEZLwJXgHaE8&pid=Api&P=0&h=180","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'High-grade MDF with Mirror Finish', '5 Years Warranty', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'services'),
        ('f2cd656a-9956-4f49-9617-7d56af0568c2', 'Master Bedroom Suite', 'Complete bedroom solution including wardrobe, bed-back unit, and side tables. Features mirror finish and mood lighting.', 830, 'bedroom', '{"https://i.pinimg.com/originals/6f/c7/43/6fc74369dcea69b6be7953cbbbdcef97.jpg","https://res.cloudinary.com/dqflsbruc/image/upload/v1746246486/Blue_White_Modern_Wavy_Lines_Name_Stationery_Note_Card_j4xb8t.png"}', 'Premium MDF with PU Finish', '5 Years Warranty', 'Made in India', '2025-04-25 14:06:15.92372+00', null, 'services');
    END IF;
END $$;

-- Drop the old products table if it exists (after data migration)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        DROP TABLE public.products;
    END IF;
END $$;