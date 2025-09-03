import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { getItems, Item } from '../lib/supabase';

const TopRatedSection = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      console.log('🚀 TopRatedSection: Starting to fetch top-rated items...');
      setIsLoading(true);
      try {
        console.log('⭐ TopRatedSection: Trying to fetch items with section="top-rated"...');
        let data = await getItems(undefined, 'top-rated', 6);
        
        console.log('⭐ TopRatedSection: Top-rated items found:', data?.length || 0);
        
        // If no top-rated items found, get any 6 items as fallback
        if (!data || data.length === 0) {
          console.log('⭐ TopRatedSection: No top-rated items found, fetching any 6 items as fallback...');
          data = await getItems(undefined, undefined, 6);
          console.log('⭐ TopRatedSection: Fallback items found:', data?.length || 0);
        }
        
        console.log('✅ TopRatedSection: Final items to display:', data?.length || 0);
        setItems(data);
      } catch (error) {
        console.error('❌ TopRatedSection: Error fetching items:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Top Rated Collections
          </motion.h2>
          <motion.p 
            className="section-subtitle mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our most loved designs chosen by our customers
          </motion.p>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map(item => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
                className="card group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-full flex items-center">
                    <Star size={16} className="fill-current mr-1" />
                    <span className="font-medium">Top Rated</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <span className="text-secondary-400 font-medium">
                        ₹{item.price_per_sqft}/sqft
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  
                  <Link 
                    to={`/product/${item.id}`}
                    className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    View Details
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="btn btn-outline"
          >
            View All Designs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection;