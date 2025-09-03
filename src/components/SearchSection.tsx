import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchItems, Item } from '../lib/supabase';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle search
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        console.log('🔍 SearchSection: Initiating search for query:', searchQuery);
        setIsSearching(true);
        try {
          const data = await searchItems(searchQuery);
          console.log('🔍 SearchSection: Search completed, results:', data?.length || 0);
          setSearchResults(data);
          setShowResults(true);
        } catch (error) {
          console.error('❌ SearchSection: Error during search:', error);
          setSearchResults([]);
          setShowResults(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        console.log('🔍 SearchSection: Query too short, clearing results');
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto" ref={searchRef}>
          <div className="relative">
            <motion.div 
              className="flex items-center relative bg-white rounded-full shadow-elegant overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Search className="absolute left-5 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for designs, rooms, or styles..."
                className="py-4 pl-12 pr-10 w-full outline-none text-gray-700 bg-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-5 text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </motion.div>

            {/* Search Results */}
            {showResults && (
              <motion.div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-elegant-lg z-20 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Searching...</p>
                  </div>
                ) : (
                  <>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map(item => (
                          <Link 
                            key={item.id} 
                            to={`/product/${item.id}`}
                            className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-16 h-16 flex-shrink-0">
                              <img 
                                src={item.images[0]} 
                                alt={item.title} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="ml-4 flex-grow">
                              <h3 className="text-md font-medium text-gray-800">{item.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                              <span className="text-sm font-medium text-secondary-600">₹{item.price_per_sqft}/sqft</span>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                          </Link>
                        ))}
                        <div className="p-3 bg-gray-50 text-center">
                          <Link 
                            to={`/services?search=${searchQuery}`}
                            className="text-primary-600 font-medium text-sm hover:text-primary-700"
                          >
                            View all results
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                        <Link 
                          to="/services" 
                          className="mt-2 inline-block text-primary-600 font-medium hover:text-primary-700"
                        >
                          Browse all designs
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;