import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronRight, GridIcon, ListIcon, X } from 'lucide-react';
import { getItems, Item } from '../lib/supabase';
import { useCart } from '../contexts/CartContext'; // Keep this import

const categories = [
  { id: 'all', name: 'All Designs' },
  { id: 'tv-units', name: 'TV Units' },
  { id: 'living-room', name: 'Living Room' },
  { id: 'kitchen', name: 'Kitchen Designs' },
  { id: 'showcases', name: 'Show Cases' },
  { id: 'bedroom', name: 'Bedroom' },
];

const ServicesPage = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [dimensions, setDimensions] = useState({ width: '', height: '' });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Extract search query from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      console.log('🚀 ServicesPage: Starting to fetch items for category:', selectedCategory);
      setIsLoading(true);
      
      try {
        // Pass undefined for category when 'all' is selected to get ALL products
        const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
        console.log('📂 ServicesPage: Category filter being applied:', categoryFilter || 'NONE (fetch all)');
        
        const data = await getItems(categoryFilter);
        
        console.log('📦 ServicesPage: Items received from database:', data?.length || 0);
        let filteredItems = data;
        
        // Apply search filter
        if (searchQuery.trim()) {
          console.log('🔍 ServicesPage: Applying client-side search filter for:', searchQuery);
          filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
          console.log('🔍 ServicesPage: After search filter:', filteredItems.length, 'items');
        }
        
        console.log('✅ ServicesPage: Final items to display:', filteredItems.length);
        setItems(filteredItems);
      } catch (error) {
        console.error('❌ ServicesPage: Error fetching items:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddToCart = async (item: Item) => {
    setSelectedItem(item);
    setDimensions({ width: '', height: '' });
    setNotes('');
    setError('');
    setShowModal(true);
  };

  const handleSubmitDimensions = async () => {
    if (!selectedItem) return;
    
    if (!dimensions.width || !dimensions.height) {
      setError('Please enter both width and height');
      return;
    }

    const width = parseFloat(dimensions.width);
    const height = parseFloat(dimensions.height);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      setError('Please enter valid dimensions');
      return;
    }

    // Convert centimeters to square feet
    // 1 sq ft = 929.03 sq cm
    const sqft = (width * height) / 929.03;

    try {
      await addToCart(selectedItem.id, 1, width, height, notes);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  const itemContainerVariants = {
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
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-12">
        <div className="container-custom">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-white/80 max-w-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse our premium interior design solutions for every part of your home. All designs come with professional installation services.
          </motion.p>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Search and filters */}
        <div className="mb-8 bg-white rounded-xl shadow-elegant p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs, rooms, or styles..."
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <button type="submit" className="btn btn-primary md:flex-shrink-0">
              Search
            </button>
            
            {/* Mobile filter toggle */}
            <button 
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-outline md:hidden"
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown size={18} className={`ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Desktop filter options */}
          <div className="hidden md:flex items-center justify-between mt-6">
            <div className="flex items-center space-x-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Grid view"
              >
                <GridIcon size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="List view"
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          {/* Mobile filter options */}
          {isFilterOpen && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <h3 className="font-medium text-gray-700 mt-4 mb-3">View</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <GridIcon size={16} className="mr-1" />
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <ListIcon size={16} className="mr-1" />
                  List
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-medium text-gray-800">{items.length}</span> results
            {selectedCategory !== 'all' && ` for "${categories.find(c => c.id === selectedCategory)?.name}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Items display */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-elegant">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">No Results Found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any designs matching your criteria.
                    <br />Try adjusting your search or browse all our products.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="btn btn-primary"
                  >
                    View All Designs
                  </button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                variants={itemContainerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {items.map(item => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className={`bg-white rounded-xl shadow-elegant overflow-hidden ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                  >
                    <div className={`${viewMode === 'list' ? 'sm:w-1/3' : ''} relative overflow-hidden`}>
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className={`w-full ${viewMode === 'grid' ? 'h-56' : 'h-full'} object-cover transition-transform duration-500 hover:scale-105`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <span className="text-white font-medium">₹{item.price_per_sqft}/sqft</span>
                      </div>
                    </div>
                    <div className={`p-6 ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
                      <span className="text-sm bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                        {item.category.replace('-', ' ')}
                      </span>
                      <h3 className="text-xl font-serif font-semibold mt-2 mb-2">{item.title}</h3>
                      <p className={`text-gray-600 mb-4 ${viewMode === 'grid' ? 'line-clamp-2' : ''}`}>
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <Link 
                          to={`/product/${item.id}`}
                          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                        >
                          View Details
                          <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="btn btn-primary"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Dimensions Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-elegant max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-semibold">Enter Dimensions</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter width in centimeters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter height in centimeters"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Add any special requirements or notes"
                    rows={3}
                  />
                </div>

                {error && (
                  <p className="text-error-500 text-sm">{error}</p>
                )}

                <button
                  onClick={handleSubmitDimensions}
                  className="btn btn-primary w-full"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;