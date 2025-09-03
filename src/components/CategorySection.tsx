import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tv, Sofa, ChefHat, Bed, Award } from 'lucide-react';
import { getItems, Item } from '../lib/supabase';

const categories = [
  { id: 'tv-units', name: 'TV Units', icon: Tv, color: 'bg-primary-100 text-primary-600' },
  { id: 'living-room', name: 'Living Room', icon: Sofa, color: 'bg-secondary-100 text-secondary-600' },
  { id: 'kitchen', name: 'Kitchen Designs', icon: ChefHat, color: 'bg-accent-100 text-accent-600' },
  { id: 'showcases', name: 'Show Cases', icon: Award, color: 'bg-success-100 text-success-500' },
  { id: 'bedroom', name: 'Bedroom', icon: Bed, color: 'bg-warning-100 text-warning-500' },
];

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('tv-units');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      console.log('🚀 CategorySection: Starting to fetch items for category:', selectedCategory);
      setIsLoading(true);
      
      try {
        console.log('📂 CategorySection: Fetching items with category filter:', selectedCategory);
        const data = await getItems(selectedCategory, undefined, 6);
        console.log('📦 CategorySection: Items received:', data?.length || 0);
        console.log('✅ CategorySection: Setting items for display');
        setItems(data);
      } catch (error) {
        console.error('❌ CategorySection: Error fetching items:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, [selectedCategory]);

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
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Collection
          </motion.h2>
          <motion.p 
            className="section-subtitle mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse through our premium designs for every part of your home
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-5 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? `${category.color} shadow-md`
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={18} className="mr-2" />
              {category.name}
            </motion.button>
          ))}
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

export default CategorySection