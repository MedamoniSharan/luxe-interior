import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Tag, Ruler, ShoppingCart, Calculator } from 'lucide-react';
import { getItem } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';

type Item = Database['public']['Tables']['items']['Row'];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [showEstimator, setShowEstimator] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await getItem(id);
      setItem(data);
      setIsLoading(false);
    };
    
    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!item?.id || !width || !height) {
      setShowEstimator(true);
      return;
    }

    try {
      await addToCart(item.id, 1, width, height, notes);
      setShowEstimator(false);
      setWidth(0);
      setHeight(0);
      setNotes('');
      setEstimatedPrice(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const calculateEstimate = () => {
    if (!item || !width || !height) return;
    
    // Convert square centimeters to square feet
    const sqft = (width * height) / 929.03; // 1 sq ft = 929.03 sq cm
    setEstimatedPrice(sqft * item.price_per_sqft);
  };

  const handleNextImage = () => {
    if (item) {
      setActiveImage((prev) => (prev + 1) % item.images.length);
    }
  };

  const handlePrevImage = () => {
    if (item) {
      setActiveImage((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-gray-800 mb-4">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="btn btn-primary">
          Browse Our Items
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container-custom">
        <Link to="/services" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft size={18} className="mr-2" />
          Back to Services
        </Link>

        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]">
                <motion.img
                  key={activeImage}
                  src={item.images[activeImage]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                
                {item.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-1">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                        activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded-full uppercase tracking-wide">
                  {item.category.replace('-', ' ')}
                </span>
                <h1 className="text-3xl font-serif font-bold text-gray-800 mt-3">{item.title}</h1>
              </div>

              <div className="flex items-center space-x-2">
                <Tag size={20} className="text-secondary-500" />
                <span className="text-2xl font-bold text-secondary-600">₹{item.price_per_sqft}</span>
                <span className="text-gray-600">per sq.ft</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Material Type</h4>
                    <p className="text-gray-800">{item.material_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Warranty</h4>
                    <p className="text-gray-800">{item.warranty}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Origin</h4>
                    <p className="text-gray-800">{item.origin}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {isAuthenticated ? (
                    <button 
                      onClick={handleAddToCart}
                      className="btn btn-primary flex-1 sm:flex-initial"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    <Link 
                      to="/login"
                      className="btn btn-primary flex-1 sm:flex-initial"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Login to Add to Cart
                    </Link>
                  )}
                  <button 
                    onClick={() => setShowEstimator(!showEstimator)}
                    className="btn btn-outline flex-1 sm:flex-initial"
                  >
                    <Calculator size={18} className="mr-2" />
                    Calculate Estimate
                  </button>
                </div>

                {showEstimator && (
                  <motion.div 
                    className="mt-6 p-6 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-medium text-gray-800 mb-4">Calculate Price Estimate</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          value={width || ''}
                          onChange={(e) => setWidth(parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          placeholder="Enter width in centimeters"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={height || ''}
                          onChange={(e) => setHeight(parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          placeholder="Enter height in centimeters"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
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

                    <button 
                      onClick={calculateEstimate}
                      className="btn btn-secondary w-full"
                    >
                      Calculate
                    </button>

                    {estimatedPrice !== null && (
                      <div className="mt-4 text-center">
                        <p className="text-gray-600">Estimated Price:</p>
                        <p className="text-2xl font-bold text-secondary-600">
                          ₹{estimatedPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ({((width * height) / 929.03).toFixed(2)} sq.ft)
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;